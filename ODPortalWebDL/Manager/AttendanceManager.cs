using ODPortalWebDL.DataAccess;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.Manager
{
    public class AttendanceManager
    {
        private readonly AttendanceDataAccess _attendanceDataAccess;
        public AttendanceManager()
        {
            _attendanceDataAccess = new AttendanceDataAccess();
        }

        public List<ActivityAttendanceModal> GetPeopleDate(string status)
        {
            return _attendanceDataAccess.GetPeopleDate(status);
        }
    }
}
