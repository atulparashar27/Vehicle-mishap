using Microsoft.Extensions.Logging;
using ODPortalWebDL.DataAccess;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ODPortalWebDL.Manager
{
    public class AttendanceManager
    {
        private readonly AttendanceDataAccess _attendanceDataAccess;
        //private readonly ILogger _logger;
        public AttendanceManager()
        {
            //_logger = logger;
            _attendanceDataAccess = new AttendanceDataAccess();
        }

        public async Task<List<ActivityAttendanceModal>> GetPeopleDate(string status)
        {
            return await _attendanceDataAccess.GetPeopleDate(status);
        }

        public bool SubmitActivityAttendance(SubmitActivityAttendanceModal submitActivityAttendanceModal)
        {
            return _attendanceDataAccess.SubmitActivityAttendance(submitActivityAttendanceModal);
        }

        public SavedAttendanceModal GetSavedAttendance(string actCode, DateTime actDate)
        {
            return _attendanceDataAccess.GetSavedAttendance(actCode, actDate);
        }

        public bool DeleteSavedAttendance(SubmitActivityAttendanceModal deleteSavedAttendance)
        {
            return _attendanceDataAccess.DeleteSavedAttendance(deleteSavedAttendance);
        }

        public bool SubmitVisitorsAttendance(List<VisitorsAttendanceModal> visitors)
        {
            return _attendanceDataAccess.SubmitVisitorsAttendance(visitors);
        }

        public bool VoidActivityAttendance(string actCode, DateTime actDate)
        {
            _attendanceDataAccess.VoidActivityAttendance(actCode, actDate);
            return true;
        }

        public bool UnVoidActivityAttendance(string actCode, DateTime actDate)
        {
            _attendanceDataAccess.UnVoidActivityAttendance(actCode, actDate);
            return true;
        }
    }
}
