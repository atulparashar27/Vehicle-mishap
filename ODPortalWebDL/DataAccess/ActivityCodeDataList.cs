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

        public static DateTime? startDate = Convert.ToDateTime("01/10/2020");
        public static DateTime? endDate = Convert.ToDateTime("30/09/2021");
        internal async Task<List<AllActivityCode>> GetAllActivity()
        {
            //var show = _dbConnection.GetModelDetails(TestSQL);
            //var lst = await _dbConnection.GetModelDetailsAsync(RawSQL.LastSixMonthAttendanceRecord());
            var lst = await _dbConnection.GetModelDetailsAsync(RawSQL.GetAllActCode());
            var tableResponse = JsonConvert.SerializeObject(lst);
            return /*Task.FromResult*/(JsonConvert.DeserializeObject<List<AllActivityCode>>(tableResponse));
        }

        internal bool ManageActivity(AllActivityCode allActivityCode, string action)
        {
            int rowAffected;
            switch (action)
            {
                case "ADD": _dbConnection.AddNewActivity(allActivityCode, out rowAffected);
                    break;
                case "EDIT": _dbConnection.UpdateActivity(allActivityCode, out rowAffected);
                    break;
                case "DELETE": _dbConnection.DeleteActivity(allActivityCode, out rowAffected);
                    break;
                default:
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
