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
        public ActivityCodeData()
        {
            _activityCodeDataList = new ActivityCodeDataList();
        }
        public List<AllActivityCode> GetAllActivity()
        {
            return _activityCodeDataList.GetAllActivity();
        }
    }
}
