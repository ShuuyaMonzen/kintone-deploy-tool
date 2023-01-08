using KintoneDeployTool.DataAccess.DomainModel;

namespace KintoneDeployTool.DataAccess.Repository
{
    public class ActionLogRepository : BaseRepository<AppInnerDBContext>
    {
        public ActionLogRepository(AppInnerDBContext dbContext) : base(dbContext)
        {
        }

        public void AddActionLog(TrnActionLog trnActionLog)
        {
            DbContext.Add(trnActionLog);
        }

    }
}
