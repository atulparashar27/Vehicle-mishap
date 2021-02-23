using ODPortalWebDL.DTO;
using ODPortalWebDL.DTO.ExceptionModal;
using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.Constants
{
    public static class RawSQL
    {
        public static string CheckAuth(string userName, string passWord)
        {
            return $"SELECT Name_Full, Date_Birth, Roll_No, UID_No " +
                    $"FROM BranchMaster " +
                    $"WHERE UID_No='{userName}' " +
                    $"AND Status='CR' " ;
        }

        internal static string GetAllUserPassword(string userName)
        {
            return $"SELECT UserName, Password FROM Login_Details WHERE UserName = '{userName}'";
        }

        internal static string GetAllUserRoles(string userName)
        {
            return $"SELECT * FROM Users_Roles where UserId = '{userName}'";
        }

        public static string GetAllActCode()
        {
            return $"SELECT Act_cd as ActId, Act_Name as ActName FROM ActivityCode WHERE DeleteInd is null";
        }

        public static string GetSingleActivity(string actCode, DateTime actDate)
        {
            return $"SELECT Act_cd as ActId, Act_Name as ActName FROM ActivityCode WHERE DeleteInd is null and Act_cd = '{actCode}'";
        }

        public static string GetAllPeopleList(string status)
        {
            return $"SELECT * FROM BranchMaster WHERE Status='{status}'";
        }

        public static string GetSavedAttendance(string actCode, DateTime actDate)
        {
            return $"SELECT Gender, Name_Full, INI_JIG_NON, Sant_su, UID_No, Act_Date, attend.Roll_No as Roll_No " +
                    $"FROM Act2018 attend, BranchMaster branch " +
                    $"WHERE attend.Roll_NO = branch.Roll_NO " +
                    $"AND attend.Act_cd='{actCode}' " +
                    $"AND attend.Act_Date=#{actDate}# ";
        }

        public static string GetSaveVisitorsAttendance(string actCode, DateTime actDate)
        {
            return $"SELECT VisitorName, Act_cd, Act_date, Branch_Visitor, Gender, Initiated, Age " +
                    $"FROM VisitorOD " +
                    $"WHERE Act_cd='{actCode}' " +
                    $"AND Act_date=#{actDate}# ";
        }

        internal static string ReportsBranchPeopleAttendance(BranchPeopleAttendance branchPeopleAttendance)
        {
            string allActCode = string.Join("' , '", branchPeopleAttendance.ActivityCode);
            var startAge = Convert.ToDouble(branchPeopleAttendance.StartAge);
            var endAge = Convert.ToDouble(branchPeopleAttendance.EndAge);
            return $"SELECT code.Act_cd, code.Act_Name as Act_Name, mstBr.UID_No as UID_No, " +
                    $"mstBr.Roll_NO as Roll_NO, mstBr.Name_Full as Name_Full, " +
                    $"mstBr.INI_JIG_NON as INI_JIG_NON, attend.Act_Date as Act_Date, " +
                    $"count(mstBr.Roll_NO) as AttendanceCount " +
                    $"FROM BranchMaster mstBr, Act2018 attend, ActivityCode code " +
                    $"WHERE mstBr.Roll_NO = attend.Roll_NO " +
                    $"AND attend.Act_cd = code.Act_cd " +
                    $"AND attend.Act_cd in ('{allActCode}') " +
                    $"AND mstBr.Age >= {startAge} " +
                    $"AND mstBr.Age <= {endAge} " +
                    $"AND attend.Act_Date >= #{branchPeopleAttendance.StartDate}# " +
                    $"AND attend.Act_Date <= #{branchPeopleAttendance.EndDate}# " +
                    $"GROUP BY code.Act_Name, mstBr.UID_No, mstBr.Roll_NO, mstBr.Name_Full, " +
                    $"mstBr.INI_JIG_NON, attend.Act_Date, code.Act_cd " +
                    $"ORDER BY mstBr.Name_Full" ;
        }


        internal static string ReportsBranchIndividualAttendance(BranchPeopleAttendance branchPeopleAttendance)
        {
            var rollNo = Convert.ToDouble(branchPeopleAttendance.RollNo);
            return $"SELECT code.Act_Name as Act_Name, mstBr.UID_No as UID_No, " +
                    $"mstBr.Roll_NO as Roll_NO, mstBr.Name_Full as Name_Full, " +
                    $"mstBr.INI_JIG_NON as INI_JIG_NON, attend.Act_Date as Act_Date, " +
                    $"count(mstBr.Roll_NO) as AttendanceCount " +
                    $"FROM BranchMaster mstBr, Act2018 attend, ActivityCode code " +
                    $"WHERE mstBr.Roll_NO = attend.Roll_NO " +
                    $"AND attend.Act_cd = code.Act_cd " +
                    $"AND attend.Act_cd = ('{branchPeopleAttendance.SingleActivityCode}') " +
                    $"AND attend.Act_Date >= #{branchPeopleAttendance.StartDate}# " +
                    $"AND attend.Act_Date <= #{branchPeopleAttendance.EndDate}# " +
                    $"AND (mstBr.Roll_No = {rollNo}) " +
                    $"GROUP BY code.Act_Name, mstBr.UID_No, mstBr.Roll_NO, mstBr.Name_Full, " +
                    $"mstBr.INI_JIG_NON, attend.Act_Date ";
        }

        internal static string GetProfileData(string uidNo, string rollNo)
        {
            var doubleRollNo = Convert.ToDouble(rollNo);
            if (!string.IsNullOrWhiteSpace(uidNo))
            {
                return $"SELECT * FROM BranchMaster WHERE Uid_No = '{uidNo}'";
            }
            else if (!string.IsNullOrWhiteSpace(rollNo))
            {
                return $"SELECT * FROM BranchMaster WHERE Roll_NO = '{doubleRollNo}'";
            }
            else
            {
                throw new CustomException("This user is not valid");
            }
        }

        internal static string GetUserRolesData()
        {
            return "SELECT * FROM Roles";
        }

        internal static string GetUserIndividualRoles(string userName)
        {
            return $"SELECT urs.RoleId as RoleId, RoleName, RoleDesc, AccessType " +
                    $"FROM Users_Roles urs inner join Roles rs " +
                    $"on urs.RoleId = rs.RoleId " +
                    $"WHERE urs.UserId = '{userName}'";
        }
    }
}
