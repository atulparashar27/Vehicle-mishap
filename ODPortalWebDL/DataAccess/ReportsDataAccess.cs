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
            var lst = new List<BranchPeopleAttendance>();

            // Users Attendance
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.ReportsBranchPeopleAttendance(branchPeopleAttendance));
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

            // Visitors Attendance Result
            var visitorsAttendance = _dbConnection.GetModelDetails(RawSQL.ReportsBranchVisitorsPeopleSummary(branchPeopleAttendance.ActivityCode,
                branchPeopleAttendance.StartDate, branchPeopleAttendance.EndDate));
            foreach (DataRow dataRow in visitorsAttendance.AsEnumerable())
            {
                var record = new BranchPeopleAttendance()
                {
                    BrTitle = dataRow.Field<string>("Initiated").ToLower() == "yes".ToLower() ? "Initiated" : "Other",
                    ActivityName = dataRow.Field<string>("Act_Name"),
                    AttendanceDate = dataRow.Field<DateTime?>("Act_Date"),
                    IsVisitors = true
                };
                lst.Add(record);
            }

            // Voided Records
            var tableResponseVoidedRec = _dbConnection.GetModelDetails(RawSQL.ReportsBranchPeopleAttendanceVoided(branchPeopleAttendance.ActivityCode, branchPeopleAttendance.StartDate, branchPeopleAttendance.EndDate));
            foreach (DataRow dataRow in tableResponseVoidedRec.AsEnumerable())
            {
                var record = new BranchPeopleAttendance
                {
                    UidNo = "NA",
                    Name = "NA",
                    RollNo = -1,
                    BrTitle = "NA",
                    AttendanceCount = 1,
                    ActivityName = dataRow.Field<string>("Act_Name"),
                    SingleActivityCode = dataRow.Field<string>("Act_cd"),
                    AttendanceDate = dataRow.Field<DateTime?>("Act_Date"),
                    MobileNum = "NA"
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
            List<BranchPeopleAttendance> lst = new List<BranchPeopleAttendance>();
            
            // Registered Users Attendance Result
            var branchAttendance = _dbConnection.GetModelDetails(RawSQL.ReportsBranchPeopleSummary(branchPeopleAttendance));
            foreach (DataRow dataRow in branchAttendance.AsEnumerable())
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

            // Visitors Attendance Result
            var visitorsAttendance = _dbConnection.GetModelDetails(RawSQL.ReportsBranchVisitorsPeopleSummary(branchPeopleAttendance.ActivityCode, branchPeopleAttendance.StartDate, branchPeopleAttendance.EndDate));
            foreach (DataRow dataRow in visitorsAttendance.AsEnumerable())
            {
                var record = new BranchPeopleAttendance()
                {
                    BrTitle = dataRow.Field<string>("Initiated").ToLower() == "yes".ToLower() ? "Initiated" : "Other" ,
                    ActivityName = dataRow.Field<string>("Act_Name"),
                    AttendanceDate = dataRow.Field<DateTime?>("Act_Date"),
                    IsVisitors = true
                };
                lst.Add(record);
            }
            List<BranchAttendanceSummary> finalLst = new List<BranchAttendanceSummary>();
            foreach (var calc in lst.OrderBy(s => s.AttendanceDate).GroupBy(s => new { s.ActivityName , s.AttendanceDate }))
            {
                var totalIni = calc.Where(s => s.IsVisitors != true).Count(s => s.BrTitle == "Initiated");
                var totalJig = calc.Count(s => s.BrTitle == "Jigyasu");
                var totalOther = calc.Where(s => s.IsVisitors != true).Count(s => s.BrTitle == "Other");
                var totalChild = calc.Count(s => s.BrTitle == "Children");
                var totalSantSu = calc.Count(s => s.BrTitle == "SantSu");
                var totalVisitorIni = calc.Where(s => s.IsVisitors).Count(s => s.BrTitle == "Initiated");
                var totalVisitorOthers = calc.Where(s => s.IsVisitors).Count(s => s.BrTitle == "Other");
                var totalPeople = totalIni + totalJig + totalOther + totalChild + totalSantSu + totalVisitorIni + totalVisitorOthers;
                finalLst.Add(new BranchAttendanceSummary
                {
                    ActivityName = calc.Key.ActivityName,
                    AttendanceDate = calc.Key.AttendanceDate,
                    TotalIni = totalIni,
                    TotalJig = totalJig,
                    TotalChil = totalChild + totalSantSu,
                    TotalOther = totalOther,
                    TotalVisitorIni = totalVisitorIni,
                    TotalVisitorOther = totalVisitorOthers,
                    TotalPeople = totalPeople
                });
            }

            // Voided Attendance 
            List<BranchPeopleAttendance> voidLst = new List<BranchPeopleAttendance>();
            var branchVoidedRec = _dbConnection.GetModelDetails(RawSQL.ReportsBranchPeopleAttendanceVoided(branchPeopleAttendance.ActivityCode, branchPeopleAttendance.StartDate, branchPeopleAttendance.EndDate));
            foreach (DataRow dataRow in branchVoidedRec.AsEnumerable())
            {
                var record = new BranchPeopleAttendance()
                {
                    BrTitle = "NA",
                    ActivityName = dataRow.Field<string>("Act_Name"),
                    AttendanceDate = dataRow.Field<DateTime?>("Act_Date")
                };
                voidLst.Add(record);
            }
            foreach(var add in voidLst)
            {
                finalLst.Add(new BranchAttendanceSummary
                {
                    ActivityName = add.ActivityName,
                    AttendanceDate = add.AttendanceDate,
                    TotalIni = -1,
                    TotalJig = -1,
                    TotalChil = -1,
                    TotalOther = -1,
                    TotalVisitorIni = -1,
                    TotalVisitorOther = -1,
                    TotalPeople = -1,
                });
            }
            return finalLst;
        }
    }
}
