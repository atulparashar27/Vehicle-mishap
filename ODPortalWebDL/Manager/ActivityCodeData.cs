using Microsoft.Extensions.Logging;
using ODPortalWebDL.DataAccess;
using ODPortalWebDL.DTO;
using ODPortalWebDL.DTO.ExceptionModal;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ODPortalWebDL.Manager
{
    public class ActivityCodeData
    {
        private readonly ActivityCodeDataList _activityCodeDataList;
        //private readonly ILogger _logger;
        public ActivityCodeData()
        {
            //_logger = logger;
            _activityCodeDataList = new ActivityCodeDataList();
        }
        public Task<List<AllActivityCode>> GetAllActivity()
        {
            return _activityCodeDataList.GetAllActivity();
        }

        public bool ManageActivity(AllActivityCode allActivityCode, string action)
        {
            if (string.IsNullOrWhiteSpace(action))
            {
                throw new CustomException("Selected Action cannot be perfomed");
            }
            return _activityCodeDataList.ManageActivity(allActivityCode, action);
        }
    }
}
