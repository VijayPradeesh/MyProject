namespace CustomerPortal.Services.Repositories.JobActivityRepo
{
    public static class Common
    {
        public static void FindThisWeekStartDayAndEndDay(out DateTime firstDate, out DateTime lastDate, out DateTime lockdownReferalDate, bool currentWeek)
        {
            var givenDate = DateTime.Today;
            while (givenDate.DayOfWeek.ToString() != "Sunday")
                givenDate = givenDate.AddDays(-1);
            firstDate = givenDate;
            lockdownReferalDate = givenDate.AddHours(9);
            lastDate = firstDate.AddDays(6);
            if (!currentWeek)
            {
                firstDate = firstDate.AddDays(-7);
            }

        }
        public static void FindLockdownDate(DateTime firstDate, out DateTime lockdownDate, bool currentWeek)
        {
            if (DateTime.Now > firstDate)
            {
                lockdownDate = firstDate.AddDays(8);
            }
            else
            {
                lockdownDate = firstDate.AddDays(1);
            }

        }
    }
}
