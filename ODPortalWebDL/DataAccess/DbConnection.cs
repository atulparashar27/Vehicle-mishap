using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class DbConnection
    {
        private readonly ILogger<DbConnection> _logger;
        private readonly string path = Environment.CurrentDirectory + $"\\App_Data\\odrsa-database.accdb";
        private readonly string prod = "d:\\DZHosts\\LocalUser\\atulparashar27\\www.odrsa.somee.com\\server\\App_Data\\odrsa-database.accdb";
        private readonly string connString = "";

        public DbConnection()
        {
            ILoggerFactory loggerFactory = new LoggerFactory();
            _logger = loggerFactory.CreateLogger<DbConnection>();
            connString = $"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={path};Persist Security Info=True";
        }
        public DataTable GetModelDetails(string rawSql)
        {
            _logger.LogInformation($"$$$Initial Connection####");
            DataTable table = new DataTable();
            try
            {
                using (var sqlCon = new OleDbConnection(connString))
                {                    
                    if (sqlCon.State.ToString().Trim().ToLower() == "closed")
                    {
                        _logger.LogInformation($"#####Connection Open####");
                        sqlCon.Open();
                    }
                    using (var sqlCmd = new OleDbCommand(rawSql, sqlCon))
                    {
                        sqlCmd.CommandTimeout = 300;
                        using (var sqlAdapt = new OleDbDataAdapter(sqlCmd))
                        {
                            _logger.LogWarning($"#####Table  Retrieved####");
                            sqlAdapt.Fill(table);
                            return table;
                        }
                    }
                }
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
                        foreach (var rollNo in submitActivityAttendanceModal.RollNoList)
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddRange(new OleDbParameter[]
                            {
                                new OleDbParameter { ParameterName = "@Roll_NO", Value = rollNo },
                                new OleDbParameter { ParameterName = "@Act_cd", Value = submitActivityAttendanceModal.ActivityCode },
                                new OleDbParameter { ParameterName = "@Act_Date", Value = submitActivityAttendanceModal.ActivityDate },
                            });
                            final = final + cmd.ExecuteNonQuery();
                        }
                    }
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
                DataTable tableColumns = sqlCon.GetOleDbSchemaTable(OleDbSchemaGuid.Columns, new object[] { null, null, "Roles", null });
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
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand(@"INSERT into ActivityCode (Act_cd, Act_Name) VALUES (@Act_cd, @Act_Name)", connection))
                    {
                        cmd.CommandTimeout = 300;
                        cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_cd", Value = (Convert.ToInt16(maxCount) + 1).ToString() });
                        cmd.Parameters.Add(new OleDbParameter { ParameterName = "@Act_Name", Value = allActivityCode.ActName });
                        rowAffected = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"ManageActivity####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                rowAffected = 0;
            }
        }
        public void UpdateActivity(AllActivityCode allActivityCode, out int rowAffected)
        {
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand())
                    {
                        cmd.CommandTimeout = 300;
                        cmd.Connection = connection;
                        cmd.CommandText = "UPDATE ActivityCode SET Act_Name = '" + allActivityCode.ActName + "' WHERE Act_cd = '"+ allActivityCode.ActId +"'";
                        rowAffected = cmd.ExecuteNonQuery();
                    }
                }
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
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand($"DELETE FROM ActivityCode WHERE Act_cd = '{allActivityCode.ActId}'", connection))
                    {
                        cmd.CommandTimeout = 300;
                        rowAffected = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"ManageActivity####Error Message ->>>{ex} && {ex.Message}###### + StackTrace {ex.StackTrace}######## + InnerEx{ex.InnerException}#####");
                rowAffected = 0;
            }
        }

        internal int DeleteSavedAttendance(SubmitActivityAttendanceModal deleteSavedAttendance)
        {
            var rollNos = string.Join(" , ", (deleteSavedAttendance.RollNoList));
            int final = 0;
            //GetTableStructure();
            try
            {
                using (var connection = new OleDbConnection(connString))
                {
                    connection.Open();
                    foreach (var rollNo in deleteSavedAttendance.RollNoList)
                    {
                        using (var cmd = new OleDbCommand())
                        {
                            cmd.Connection = connection;
                            cmd.CommandTimeout = 300;
                            cmd.Parameters.Clear();
                            cmd.CommandText 
                                = $"Delete FROM Act2018 WHERE Act_Date = '" + Convert.ToDateTime(deleteSavedAttendance.ActivityDate) + "' and Roll_NO = '"+ Convert.ToDouble(rollNo) +"' and Act_cd = '" + deleteSavedAttendance.ActivityCode + "'";
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
    }

}
