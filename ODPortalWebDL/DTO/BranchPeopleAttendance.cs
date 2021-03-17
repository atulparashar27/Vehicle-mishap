using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.DTO
{
    public class BranchPeopleAttendance
    {
        public List<string> ActivityCode { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string BrTitle { get; set; }
        public int? StartAge { get; set; }
        public int? EndAge { get; set; }
        public string UidNo { get; set; }
        public int? RollNo { get; set; }
        public string Name { get; internal set; }
        public int? AttendanceCount { get; internal set; }
        public string ActivityName { get; set; }
        public string SingleActivityCode { get; set; }
        public DateTime? AttendanceDate { get; internal set; }
        public string MobileNum { get; internal set; }
    }
    public class BranchPeoplePaginationAttendance
    {
        public List<BranchPeopleAttendance> BranchPeopleAttendance { get; set; }
        public int? Count { get; set; }
    }
}
