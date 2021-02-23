using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.DTO
{
    public class ActivityAttendanceModal
    {
        public string UidNo { get; set; }
        public string Name { get; set; }
        public string IniJigStatus { get; set; }
        public int RollNo { get; set; }
        public int? FamilyCode { get; set; }
    }
    public class SubmitActivityAttendanceModal
    {
        public List<int> RollNoList { get; set; }
        public string ActivityCode { get; set; }
        public string ActivityDate { get;set;}
    }

    public class SavedAttendanceModal
    {
        public string ActivityName { get; set; }
        public DateTime ActivityDate { get; set; }
        public List<SavedAttendancePeopleModal> SavedAttendancePeopleModals { get; set; }
    }
    public class SavedAttendancePeopleModal
    {
        public string UidNo { get; set; }
        public string IniJigStatus { get; set; }
        public string BranchName { get; set; }
        public string Gender { get; set; }
        public string IsSantSu { get; set; }
        public string Name { get; set; }
        public string RollNo { get; internal set; }
    }

    public class VisitorsAttendanceModal
    {
        public string VisitorName { get; set; }
        public string BranchName { get; set; }
        public string Gender { get; set; }
        public int? Age { get; set; }
        public DateTime? ActivityDate { get; set; }
        public string ActivityCode { get; set; }
        public string IsInitiated { get; set; }
    }
}
