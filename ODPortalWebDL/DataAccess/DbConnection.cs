using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class DbConnection
    {
        OleDbConnection con = new OleDbConnection();
        OleDbCommand cmd = new OleDbCommand();
        OleDbDataAdapter dataAdapter;
        private void OpenDbConnection()
        {
            try
            {
                con.Close();
                //string Path = Environment.CurrentDirectory + $"\\App_Data\\ODBranch_AttendanceEntry.accdb";
                //string[] appPath = Path.Split(new string[] { "bin" }, StringSplitOptions.None);
                //AppDomain.CurrentDomain.SetData("DataDirectory", appPath[0]);
                //d:\\DZHosts\\LocalUser\\atulparashar27\\www.odrsa.somee.com\\serverApp_Data\\ODBranch_AttendanceEntry.accdb
                con.ConnectionString = $"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=d:\\DZHosts\\LocalUser\\atulparashar27\\www.odrsa.somee.com\\serverApp_Data\\ODBranch_AttendanceEntry.accdb;Persist Security Info=True";
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
        internal void CloseDbConnection()
        {
            con.Close();
        }
    }

}
