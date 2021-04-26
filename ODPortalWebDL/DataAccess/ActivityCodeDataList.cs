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
        internal Task<List<AllActivityCode>> GetAllActivity()
        {
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
