using KintoneDeployTool.DataAccess.DomainModel;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KintoneDeployTool.DataAccess.Repository
{
    public class KintoneEnviromentRepository : BaseRepository<AppInnerDBContext>
    {
        public KintoneEnviromentRepository(AppInnerDBContext dbContext) : base(dbContext)
        {
        }

        public Task<List<MstKintoneEnviroment>> GetAllMstKintoneEnviroments()
        {
            return DbContext.MstKintoneEnviroment.IncludeAll().ToListAsync();
        }


    }
}
