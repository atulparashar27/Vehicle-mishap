using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ODPortalWebDL.Constants;
using ODPortalWebDL.DTO;
using ODPortalWebDL.DTO.ExceptionModal;
using ODPortalWebDL.Manager;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace ODPortalWebDL.DataAccess
{
    public class ActivityCodeDataList
    {
        private readonly DbConnection _dbConnection;
        //private readonly ILogger _logger;
        public ActivityCodeDataList()
        {
            //_logger = logger;
            _dbConnection = new DbConnection();
        }

        public static List<double> rollNo = new List<double>() { 217 };
        public static string rollNoTest = string.Join(',', rollNo);
        public static DateTime? startDate = Convert.ToDateTime("01/10/2020");
        public static DateTime? endDate = Convert.ToDateTime("30/09/2021");
        public string TestSQL = 
            $"select brch.Name_Full as Name, actCode.Act_Name as ActName, count(act.Act_cd) as TotalCounts  " +
            $"FROM Act2014 act, ActivityCode actCode, BranchMaster brch " +
            //$", Act2017 act1, Act2016 act2, Act2015 act3 " +
            $"WHERE act.Act_cd = actCode.Act_cd and " +
            $"brch.Roll_NO = act.Roll_NO and " +
            //$"act.Act_Date >= #{startDate}# and " +
            //$"act.Act_Date <= #{endDate}# and " +
            //$"act.Roll_NO = {rollNo} " +
            $"act.Roll_NO in ( {rollNoTest} ) " +
            $"group by act.Act_cd, brch.Name_Full, actCode.Act_Name " +
            $"order by brch.Name_Full " ;
        internal Task<List<AllActivityCode>> GetAllActivity()
        {
            //var show = _dbConnection.GetModelDetails(TestSQL);
            var tableResponse = JsonConvert.SerializeObject(_dbConnection.GetModelDetails(RawSQL.GetAllActCode()));
            return Task.FromResult(JsonConvert.DeserializeObject<List<AllActivityCode>>(tableResponse));
        }

        internal bool ManageActivity(AllActivityCode allActivityCode, string action)
        {
            int rowAffected;
            if (action == "ADD")
            {
                _dbConnection.AddNewActivity(allActivityCode, out rowAffected);
            }
            else if (action == "EDIT")
            {
                _dbConnection.UpdateActivity(allActivityCode, out rowAffected);
            }
            else if (action == "DELETE")
            {
                _dbConnection.DeleteActivity(allActivityCode, out rowAffected);
            }
            else
            {
                throw new CustomException("Failed to update Activity codes.");
            }
            if (rowAffected > 0)
            {
                return true;
            }

            throw new CustomException("Failed to update Activity codes.");
        }
    }
}
