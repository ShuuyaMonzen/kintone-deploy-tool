using KintoneDeployTool.DataAccess.DomainModel;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KintoneDeployTool.DataAccess.Repository
{
    public class KintoneAppRepository : BaseRepository<AppInnerDBContext>
    {
        public KintoneAppRepository(AppInnerDBContext dbContext) : base(dbContext)
        {
        }

        public Task<List<MstKintoneApp>> GetAllMstKintoneApps()
        {
            return DbContext.MstKintoneApp.IncludeAll().ToListAsync();
        }

        public void AddMstKintoneApp(MstKintoneApp mstKintoneApp)
        {
            DbContext.MstKintoneApp.Add(mstKintoneApp);
        }

        public void AddMstKintoneApps(IEnumerable<MstKintoneApp> mstKintoneApp)
        {
            DbContext.MstKintoneApp.AddRange(mstKintoneApp);
        }

        public void DeleteMstKintoneApp(MstKintoneApp mstKintoneApp)
        {
            DbContext.MstKintoneApp.Remove(mstKintoneApp);
        }

    }
}
