using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Threading.Tasks;

namespace ODPortalWebDL.DataAccess
{
    public class DbConnection
    {
        private readonly ILogger<DbConnection> _logger;
        //private readonly string local = Environment.CurrentDirectory + $"\\App_Data\\odrsa-database.accdb";
        //private readonly string prod = "d:\\DZHosts\\LocalUser\\atulparashar0727\\www.odrsa.somee.com\\App_Data\\odrsa-database.accdb";
        private readonly string connString = "";

        public DbConnection() 
        {
            ILoggerFactory loggerFactory = new LoggerFactory();
            _logger = loggerFactory.CreateLogger<DbConnection>();
            connString = $"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={Environment.GetEnvironmentVariable("dataSource")};Persist Security Info=True";
        }

        public async Task<DataTable> GetModelDetailsAsync(string rawSql)
        {
            _logger.LogInformation($"$$$Initial Connection####");
            DataTable table = new DataTable();

            using var sqlCon = new OleDbConnection(connString);
            try
            {
                if (sqlCon.State.ToString().Trim().ToLower() == "closed")
                {
                    _logger.LogInformation($"#####Connection Open####");
                    await sqlCon.OpenAsync();
                }
                using var sqlCmd = new OleDbCommand(rawSql, sqlCon);
                sqlCmd.CommandTimeout = int.MaxValue;
                using var sqlAdapt = new OleDbDataAdapter(sqlCmd);
                _logger.LogWarning($"#####Table  Retrieved####");
                sqlAdapt.Fill(table);
                return table;
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$GetModelDetails$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return table;
            }
            finally
            {
                await sqlCon.CloseAsync();
            }
        }

        public DataTable GetModelDetails(string rawSql)
        {
            _logger.LogInformation($"$$$Initial Connection####");
            DataTable table = new DataTable();
            try
            {
                using var sqlCon = new OleDbConnection(connString);
                if (sqlCon.State.ToString().Trim().ToLower() == "closed")
                {
                    _logger.LogInformation($"#####Connection Open####");
                    sqlCon.Open();
                }
                using var sqlCmd = new OleDbCommand(rawSql, sqlCon);
                sqlCmd.CommandTimeout = 300;
                using var sqlAdapt = new OleDbDataAdapter(sqlCmd);
                _logger.LogWarning($"#####Table  Retrieved####");
                sqlAdapt.Fill(table);
                return table;
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$GetModelDetails$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return table;
            }
        }

        public bool SaveActivityAttendance(SubmitActivityAttendanceModal submitActivityAttendanceModal)
        {
            int final = 0;
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand(@"Insert into Act2018 (Roll_NO, Act_cd, Act_Date) VALUES (@Roll_NO, @Act_cd, @Act_Date)", connection))
                    {
                        cmd.CommandTimeout = 300;
                        //Parallel.ForEach(submitActivityAttendanceModal.RollNoList , rollNo =>
                        //{
                        //   lock (lockObj)
                        //   {
                        //       cmd.Parameters.Clear();
                        //       cmd.Parameters.AddRange(new OleDbParameter[]
                        //       {
                        //            new OleDbParameter { ParameterName = "@Roll_NO", Value = rollNo },
                        //            new OleDbParameter { ParameterName = "@Act_cd", Value = submitActivityAttendanceModal.ActivityCode },
                        //            new OleDbParameter { ParameterName = "@Act_Date", Value = submitActivityAttendanceModal.ActivityDate },
                        //       });
                        //       cmd.ExecuteNonQueryAsync();
                        //   }
                        //});
                        foreach (var rollNo in submitActivityAttendanceModal.RollNoList)
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddRange(new OleDbParameter[]
                            {
                                new OleDbParameter { ParameterName = "@Roll_NO", Value = rollNo },
                                new OleDbParameter { ParameterName = "@Act_cd", Value = submitActivityAttendanceModal.ActivityCode },
                                new OleDbParameter { ParameterName = "@Act_Date", Value = submitActivityAttendanceModal.ActivityDate },
                            });
                            cmd.ExecuteNonQuery();
                        }
                    }
                    //return Task.FromResult(bool);
                    return true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$SaveActivityAttend$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return false;
            }
        }

        public void GetTableStructure()
        {
            using (var sqlCon = new OleDbConnection(connString))
            {
                sqlCon.Open();
                DataTable tableColumns = sqlCon.GetOleDbSchemaTable(OleDbSchemaGuid.Columns, new object[] { null, null, "Act2018", null });
                foreach (DataRow row in tableColumns.Rows)
                {
                    var columnNameColumn = row["COLUMN_NAME"];
                    var dateTypeColumn = row["DATA_TYPE"];
                    var ordinalPositionColumn = row["ORDINAL_POSITION"];
                }
            }
        }

        public void AddNewActivity(AllActivityCode allActivityCode, out int rowAffected)
        {
            var maxCount = GetModelDetails("select MAX(Act_cd) as Act_cd from ActivityCode").AsEnumerable().FirstOrDefault().Field<string>("Act_cd");
            try
            {
                using var connection = new OleDbConnection(connString);
                connection.Open();
                using var cmd = new OleDbCommand(@"INSERT into ActivityCode (Act_cd, Act_Name) VALUES (@Act_cd, @Act_Name)", connection);
                cmd.CommandTimeout = 300;
                cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_cd", Value = (Convert.ToInt16(maxCount) + 1).ToString() });
                cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_Name", Value = allActivityCode.ActName });
                rowAffected = cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                _logger.LogError($"ManageActivity####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                rowAffected = 0;
            }
        }

        internal void VoidActivityAttendance(string actCode, DateTime actDate)
        {
            try
            {
                using var connection = new OleDbConnection(connString);
                connection.Open();
                using var cmd = new OleDbCommand(@"Insert into Act2018 (Roll_NO, Act_cd, Act_Date, NoActivity) VALUES (@Roll_NO, @Act_cd, @Act_Date, @NoActivity)", connection);
                cmd.CommandTimeout = 300;
                cmd.Parameters.Clear();
                cmd.Parameters.AddRange(new OleDbParameter[]
                {
                    new OleDbParameter { ParameterName = "@Roll_NO", Value = -1 },
                    new OleDbParameter { ParameterName = "@Act_cd", Value = actCode },
                    new OleDbParameter { ParameterName = "@Act_Date", Value = actDate },
                    new OleDbParameter { ParameterName = "@NoActivity", Value = "NA" },
                });
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$SaveActivityAttend$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
            }
        }

        internal void UnVoidActivityAttendance(string actCode, DateTime actDate)
        {
            try
            {
                using var connection = new OleDbConnection(connString);
                connection.Open();
                using var cmd = new OleDbCommand("DELETE FROM Act2018 WHERE Act_Date = @Act_Date and Roll_NO = @Roll_NO and Act_cd = @Act_cd and NoActivity = @NoActivity", connection);
                cmd.CommandTimeout = 300;
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_Date", Value = actDate, OleDbType = OleDbType.Date });
                cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Roll_No", Value = -1, OleDbType = OleDbType.SmallInt });
                cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_cd", Value = actCode, OleDbType = OleDbType.WChar });
                cmd.Parameters.Add(new OleDbParameter { ParameterName = "@NoActivity", Value = "NA", OleDbType = OleDbType.VarChar });
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$SaveActivityAttend$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
            }
        }
        public void UpdateActivity(AllActivityCode allActivityCode, out int rowAffected)
        {
            try
            {
                using var connection = new OleDbConnection(connString);
                connection.Open();
                using var cmd = new OleDbCommand();
                cmd.CommandTimeout = 300;
                cmd.Connection = connection;
                cmd.CommandText = "UPDATE ActivityCode SET Act_Name = '" + allActivityCode.ActName + "' WHERE Act_cd = '" + allActivityCode.ActId + "'";
                rowAffected = cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                _logger.LogError($"ManageActivity####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                rowAffected = 0;
            }
        }
        public void DeleteActivity(AllActivityCode allActivityCode, out int rowAffected)
        {
            try
            {
                using var connection = new OleDbConnection(connString);
                connection.Open();
                using (var cmd = new OleDbCommand())
                {
                    cmd.CommandTimeout = 300;
                    cmd.Connection = connection;
                    cmd.CommandText = "UPDATE ActivityCode SET DeleteInd = '" + 0 + "' WHERE Act_cd = '" + allActivityCode.ActId + "'";
                    rowAffected = cmd.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"ManageActivity####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                rowAffected = 0;
            }
        }

        internal int DeleteSavedAttendance(SubmitActivityAttendanceModal obj)
        {
            int final = 0;
            List<int> validRollNum = obj.RollNoList.Where(s => s != 0).Select(s => s).ToList();
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand("DELETE FROM Act2018 WHERE Act_Date = @Act_Date and Roll_NO = @Roll_NO and Act_cd = @Act_cd", connection))
                    {
                        cmd.Connection = connection;
                        cmd.CommandTimeout = 300;
                        for (int i = 0; i < validRollNum.Count(); i++)
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_Date", Value = (obj.ActivityDate), OleDbType = OleDbType.Date });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Roll_No", Value = validRollNum[i], OleDbType = OleDbType.SmallInt });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_cd", Value = obj.ActivityCode, OleDbType = OleDbType.WChar });
                            final += cmd.ExecuteNonQuery();
                        }
                    }
                    return final;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"ManageActivity####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return 0;
            }
        }

        internal int DeleteVisitorsSavedAttendance(SubmitActivityAttendanceModal obj)
        {
            int final = 0;
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand("DELETE FROM VisitorOD WHERE Act_Date = @Act_Date and VisitorName = @VisitorName and Act_cd = @Act_cd", connection))
                    {
                        cmd.Connection = connection;
                        cmd.CommandTimeout = 300;
                        for (int i = 0; i < obj.Name.Count(); i++)
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_Date", Value = (obj.ActivityDate), OleDbType = OleDbType.Date });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@VisitorName", Value = obj.Name[i], OleDbType = OleDbType.VarChar });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_cd", Value = obj.ActivityCode, OleDbType = OleDbType.WChar });
                            final += cmd.ExecuteNonQuery();
                        }
                    }
                    return final;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"ManageActivity####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return 0;
            }
        }

        internal int UnassignRoles(UpdateRolesModal updateRolesModal)
        {
            int final = 1;
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand())
                    {
                        cmd.Connection = connection;
                        cmd.CommandTimeout = 300;
                        for (int i = 0; i < updateRolesModal.RolesDetailsList.Count; i++)
                        {
                            cmd.CommandText = "DELETE * FROM Users_Roles WHERE UserId ='"+ updateRolesModal.UidNo + "' and RoleId = "+ updateRolesModal.RolesDetailsList[i].RoleId + " and AccessType = '"+ updateRolesModal.RolesDetailsList[i].AccessType +"'";
                            cmd.ExecuteNonQuery();
                            final = final + cmd.ExecuteNonQuery();
                        }
                    }
                    return final;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$SaveActivityAttend$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return 0;
            }
        }

        internal int AssignRoles(UpdateRolesModal updateRolesModal)
        {
            int final = 0;
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand(@"Insert into Users_Roles (UserId, RoleId, AccessType) VALUES (@UserId, @RoleId, @AccessType)", connection))
                    {
                        cmd.CommandTimeout = 300;
                        for (int i = 0; i < updateRolesModal.RolesDetailsList.Count; i++)
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddRange(new OleDbParameter[]
                            {
                                new OleDbParameter { ParameterName = "@UserId", Value = updateRolesModal.UidNo },
                                new OleDbParameter { ParameterName = "@RoleId", Value = updateRolesModal.RolesDetailsList[i].RoleId },
                                new OleDbParameter { ParameterName = "@AccessType", Value = updateRolesModal.RolesDetailsList[i].AccessType },
                            });
                            final = final + cmd.ExecuteNonQuery();
                        }
                    }
                    return final;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$SaveActivityAttend$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return 0;
            }
        }


        internal int AddNewRoles(UserRolesModal userRolesModal)
        {
            int final = 0;
            var maxCount = GetModelDetails("select MAX(RoleId) as RoleId from Roles").AsEnumerable().FirstOrDefault().Field<int>("RoleId");
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand(@"INSERT into Roles (RoleId, RoleName, LastUpdatedDt, DeleteInd, RoleDesc) VALUES (@RoleId, @RoleName, @LastUpdatedDt, @DeleteInd, @RoleDesc)", connection))
                    {
                        cmd.CommandTimeout = 300;
                        cmd.Parameters.Add(new OleDbParameter { ParameterName = "@RoleId", Value = maxCount + 1, OleDbType = OleDbType.Integer });
                        cmd.Parameters.Add(new OleDbParameter { ParameterName = "@RoleName", Value = userRolesModal.RoleName.ToString(), OleDbType = OleDbType.VarWChar });
                        cmd.Parameters.Add(new OleDbParameter { ParameterName = "@LastUpdatedDt", Value = DateTime.Now, OleDbType = OleDbType.Date });
                        cmd.Parameters.Add(new OleDbParameter { ParameterName = "@DeleteInd", Value = 0, OleDbType = OleDbType.Integer }); 
                        cmd.Parameters.Add(new OleDbParameter { ParameterName = "@RoleDesc", Value = userRolesModal.RoleDesc, OleDbType = OleDbType.VarWChar });
                        final = final + cmd.ExecuteNonQuery();
                        return final;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$SaveActivityAttend$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return 0;
            }
        }

        internal int DeleteRoles(UserRolesModal userRolesModal)
        {
            int final = 0;
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand())
                    {
                        cmd.CommandTimeout = 300;
                        cmd.Connection = connection;
                        cmd.CommandText = "UPDATE Roles SET DeleteInd = " + 1 + " WHERE RoleId ="+ userRolesModal.RoleId;
                        final = final + cmd.ExecuteNonQuery();
                        return final;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$SaveActivityAttend$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return 0;
            }
        }

        internal int UpdateRoles(UserRolesModal obj)
        {
            int final = 0;
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand())
                    {
                        cmd.CommandTimeout = 300;
                        cmd.Connection = connection;
                        cmd.CommandText = "UPDATE Roles SET DeleteInd =" + 0 + " , RoleName='"+ obj.RoleName + "' , LastUpdatedDt=" + DateTime.Now.ToString("MM/dd/yyyy") + " , RoleDesc='"+ obj.RoleDesc +"' WHERE RoleId =" + obj.RoleId;
                        final = final + cmd.ExecuteNonQuery();
                        return final;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$SaveActivityAttend$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return 0;
            }
        }

        internal int SubmitVisitorsAttendance(List<VisitorsAttendanceModal> visitors)
        {
            int final = 0;
            int count = 0;
            var maxCount = GetModelDetails("select MAX(ID) as ID from VisitorOD").AsEnumerable().FirstOrDefault().Field<int>("ID");
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand(@"INSERT into VisitorOD (ID, VisitorName, Act_cd, Act_date, Branch_Visitor, Gender, Initiated, Age) VALUES (@ID, @VisitorName, @Act_cd, @Act_date, @Branch_Visitor, @Gender, @Initiated, @Age)", connection))
                    {
                        cmd.CommandTimeout = 300;
                        foreach(var i in visitors)
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@ID", Value = maxCount + 1 + count, OleDbType = OleDbType.Integer });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@VisitorName", Value = i.VisitorName, OleDbType = OleDbType.VarWChar });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_cd", Value = i.ActivityCode, OleDbType = OleDbType.VarWChar });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_date", Value = i.ActivityDate, OleDbType = OleDbType.Date });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Branch_Visitor", Value = i.BranchName, OleDbType = OleDbType.VarWChar });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Gender", Value = i.Gender, OleDbType = OleDbType.VarWChar });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Initiated", Value = i.IsInitiated, OleDbType = OleDbType.VarWChar });
                            cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Age", Value = i.Age ?? 0, OleDbType = OleDbType.Integer });
                            count++;
                            final = final + cmd.ExecuteNonQuery();
                        }
                        return final;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"$$$SaveActivityAttend$$$####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                return 0;
            }
        }
    }

}
