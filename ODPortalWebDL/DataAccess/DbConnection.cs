using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class DbConnection
    {
        private readonly ILogger<DbConnection> _logger;
        private readonly string path = Environment.CurrentDirectory + $"\\App_Data\\ODBranch_AttendanceEntry.accdb";
        private readonly string prod = "d:\\DZHosts\\LocalUser\\atulparashar27\\www.odrsa.somee.com\\server\\App_Data\\ODBranch_AttendanceEntry.accdb";
        private readonly string connString = "";

        public DbConnection()
        {
            ILoggerFactory loggerFactory = new LoggerFactory();
            _logger = loggerFactory.CreateLogger<DbConnection>();
            connString = $"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={prod};Persist Security Info=True";
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

        //string[] appPath = Path.Split(new string[] { "bin" }, StringSplitOptions.None);
        //AppDomain.CurrentDomain.SetData("DataDirectory", appPath[0]);
        //d:\\DZHosts\\LocalUser\\atulparashar27\\www.odrsa.somee.com\\serverApp_Data\\ODBranch_AttendanceEntry.accdb
    }

}
