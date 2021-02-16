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
        private readonly string path = Environment.CurrentDirectory + $"\\App_Data\\ODBranch_AttendanceEntry.accdb";
        private readonly string prod = "d:\\DZHosts\\LocalUser\\atulparashar27\\www.odrsa.somee.com\\server\\App_Data\\ODBranch_AttendanceEntry.accdb";
        OleDbConnection con = new OleDbConnection();
        OleDbCommand cmd = new OleDbCommand();
        OleDbDataAdapter dataAdapter;
        private void OpenDbConnection()
        {
            try
            {
                con.Close();
                //string[] appPath = Path.Split(new string[] { "bin" }, StringSplitOptions.None);
                //AppDomain.CurrentDomain.SetData("DataDirectory", appPath[0]);
                //d:\\DZHosts\\LocalUser\\atulparashar27\\www.odrsa.somee.com\\serverApp_Data\\ODBranch_AttendanceEntry.accdb
                
                con.ConnectionString = $"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={prod};Persist Security Info=True";
                cmd.Connection = con;
                con.Open();
            }
            catch (Exception ex)
            {
                con.Close();
            }
        }
        public DataTable GetModelDetails(string rawSql)
        {
            OpenDbConnection();
            DataTable table = new DataTable();
            try
            {
                dataAdapter = new OleDbDataAdapter(rawSql, con);
                dataAdapter.Fill(table);
                CloseDbConnection();
                return table;
            }
            catch (Exception ex)
            {
                con.Close();
                return table;
            }
        }
        public bool SaveActivityAttendance(SubmitActivityAttendanceModal submitActivityAttendanceModal)
        {
            OpenDbConnection();
            try
            {
                using (var connection = new OleDbConnection($"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={prod};Persist Security Info=True"))
                {
                    connection.Open();
                    using (var cmd = new OleDbCommand(@"Insert into Act2018 (Roll_NO, Act_cd, Act_Date) VALUES (@Roll_NO, @Act_cd, @Act_Date)", connection))
                    {
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
                        //cmd.CommandText = "Insert into Act2018 (Roll_NO, Act_cd, Act_Date) values (? ,? ,?)";
                        //cmd.Parameters.Add("Roll_NO", OleDbType.Integer, 4);
                        //cmd.Parameters.Add("Act_cd", OleDbType.VarChar, 50);
                        //cmd.Parameters.Add("Act_Date", OleDbType.DBDate);
                        //foreach(var loop in rollNoList)
                        //{
                        //    cmd.Parameters[0].Value = loop;
                        //    cmd.Parameters[1].Value = activityCode;
                        //    cmd.Parameters[2].Value = activityDate;
                        //    cmd.ExecuteNonQuery();
                        //}

                    }
                    CloseDbConnection();
                    return true;
                }
            }
            catch (Exception ex)
            {
                con.Close();
                return false;
            }
        }
        internal void CloseDbConnection()
        {
            con.Close();
        }
    }

}
