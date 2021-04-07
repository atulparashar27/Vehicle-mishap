using ODPortalWebDL.Constants;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class ReportsDataAccess
    {
        private readonly DbConnection _dbConnection;
        public ReportsDataAccess()
        {
            _dbConnection = new DbConnection();
        }
        internal BranchPeoplePaginationAttendance GetPeopleAttendance(BranchPeopleAttendance branchPeopleAttendance, int page)
        {
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.ReportsBranchPeopleAttendance(branchPeopleAttendance));
            var lst = new List<BranchPeopleAttendance>();
            foreach (DataRow dataRow in tableResponse.AsEnumerable())
            {
                var record = new BranchPeopleAttendance
                {
                    UidNo = dataRow.Field<string>("UID_No") ?? "",
                    Name = dataRow.Field<string>("Name_Full"),
                    RollNo = Convert.ToInt32(dataRow.Field<double>("Roll_No")),
                    BrTitle = dataRow.Field<string>("INI_JIG_NON") == "INI" ? "Initiated"
                                    : dataRow.Field<string>("INI_JIG_NON") == "CHL" ? "Children"
                                    : dataRow.Field<string>("INI_JIG_NON") == "OTH" ? "Other"
                                    : dataRow.Field<string>("INI_JIG_NON") == "JIG" ? "Jigyasu" : "",
                    AttendanceCount = dataRow.Field<int?>("AttendanceCount"),
                    ActivityName = dataRow.Field<string>("Act_Name"),
                    SingleActivityCode = dataRow.Field<string>("Act_cd"),
                    AttendanceDate = dataRow.Field<DateTime?>("Act_Date"),
                    MobileNum = dataRow.Field<string>("Mobile")
                };
                lst.Add(record);
            }
            var count = lst.Count();
            var finalLst = new BranchPeoplePaginationAttendance
            {
                BranchPeopleAttendance = lst.Skip((page - 1) * 500).Take(500).ToList(),
                Count = count
            };
            return finalLst;
        }

        internal BranchPeoplePaginationAttendance GetPeoplesIndividualAttendance(BranchPeopleAttendance branchPeopleAttendance)
        {
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.ReportsBranchIndividualAttendance(branchPeopleAttendance));
            List<BranchPeopleAttendance> lst = new List<BranchPeopleAttendance>();
            foreach (DataRow dataRow in tableResponse.AsEnumerable())
            {
                var record = new BranchPeopleAttendance()
                {
                    UidNo = dataRow.Field<string>("UID_No") ?? "",
                    Name = dataRow.Field<string>("Name_Full"),
                    RollNo = Convert.ToInt32(dataRow.Field<double>("Roll_No")),
                    BrTitle = dataRow.Field<string>("INI_JIG_NON") == "INI" ? "Initiated"
                                    : dataRow.Field<string>("INI_JIG_NON") == "CHL" ? "Children"
                                    : dataRow.Field<string>("INI_JIG_NON") == "OTH" ? "Other"
                                    : dataRow.Field<string>("INI_JIG_NON") == "JIG" ? "Jigyasu" : "",
                    AttendanceCount = dataRow.Field<int?>("AttendanceCount"),
                    ActivityName = dataRow.Field<string>("Act_Name"),
                    AttendanceDate = dataRow.Field<DateTime?>("Act_Date")
                };
                lst.Add(record);
            }
            var finalLst = new BranchPeoplePaginationAttendance
            {
                BranchPeopleAttendance = lst,
                Count = 0
            };
            return finalLst;
        }
        internal List<BranchAttendanceSummary> GetPeopleAttendanceSummary(BranchPeopleSummaryModel branchPeopleAttendance)
        {
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.ReportsBranchPeopleSummary(branchPeopleAttendance));
            List<BranchPeopleAttendance> lst = new List<BranchPeopleAttendance>();
            foreach (DataRow dataRow in tableResponse.AsEnumerable())
            {
                var record = new BranchPeopleAttendance()
                {
                    BrTitle = dataRow.Field<string>("INI_JIG_NON") == "INI" ? "Initiated"
                                    : dataRow.Field<string>("INI_JIG_NON") == "CHL" && string.IsNullOrWhiteSpace(dataRow.Field<string>("SANT_SU")) ? "Children"
                                    : dataRow.Field<string>("INI_JIG_NON") == "CHL" && !string.IsNullOrWhiteSpace(dataRow.Field<string>("SANT_SU")) ? "SantSu"
                                    : dataRow.Field<string>("INI_JIG_NON") == "OTH" ? "Other"
                                    : dataRow.Field<string>("INI_JIG_NON") == "JIG" ? "Jigyasu" : "",
                    ActivityName = dataRow.Field<string>("Act_Name"),
                    AttendanceDate = dataRow.Field<DateTime?>("Act_Date")
                };
                lst.Add(record);
            }

            List<BranchAttendanceSummary> finalLst = new List<BranchAttendanceSummary>();
            foreach (var calc in lst.OrderBy(s => s.AttendanceDate).GroupBy(s => new { s.ActivityName , s.AttendanceDate }))
            {
                var totalIni = calc.Count(s => s.BrTitle == "Initiated");
                var totalJig = calc.Count(s => s.BrTitle == "Jigyasu");
                var totalOther = calc.Count(s => s.BrTitle == "Other");
                var totalChild = calc.Count(s => s.BrTitle == "Children");
                var totalSantSu = calc.Count(s => s.BrTitle == "SantSu");
                var totalPeople = totalIni + totalJig + totalOther + totalChild + totalSantSu;
                finalLst.Add(new BranchAttendanceSummary
                {
                    ActivityName = calc.Key.ActivityName,
                    AttendanceDate = calc.Key.AttendanceDate,
                    TotalIni = totalIni,
                    TotalJig = totalJig,
                    TotalChil = totalChild,
                    TotalSantSu = totalSantSu,
                    TotalOther = totalOther,
                    TotalPeople = totalPeople
                });
            }
            return finalLst;
        }
    }
}
