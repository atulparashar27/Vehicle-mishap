using ODPortalWebDL.DataAccess;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.Manager
{
    public class ReportsManager
    {
        private readonly ReportsDataAccess _reportsDataAccess;
        public ReportsManager()
        {
            _reportsDataAccess = new ReportsDataAccess();
        }
        public BranchPeoplePaginationAttendance GetPeopleAttendance(BranchPeopleAttendance branchPeopleAttendance, int page)
        {
            if (!string.IsNullOrEmpty(branchPeopleAttendance.UidNo) || branchPeopleAttendance.RollNo != null)
            {
                return _reportsDataAccess.GetPeoplesIndividualAttendance(branchPeopleAttendance);
            }
            return _reportsDataAccess.GetPeopleAttendance(branchPeopleAttendance, page);
        }
    }
}
