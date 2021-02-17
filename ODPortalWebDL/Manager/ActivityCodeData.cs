using Microsoft.Extensions.Logging;
using ODPortalWebDL.DataAccess;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Text;

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
        public List<AllActivityCode> GetAllActivity()
        {
            return _activityCodeDataList.GetAllActivity();
        }
    }
}
