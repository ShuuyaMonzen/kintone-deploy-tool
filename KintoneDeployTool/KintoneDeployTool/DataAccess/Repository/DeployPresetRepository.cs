using KintoneDeployTool.DataAccess.DomainModel;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KintoneDeployTool.DataAccess.Repository
{
    public class DeployPresetRepository : BaseRepository<AppInnerDBContext>
    {
        public DeployPresetRepository(AppInnerDBContext dbContext) : base(dbContext)
        {
        }

        public Task<List<MstDeployPreset>> GetAllTrnDeployPresets()
        {
            return DbContext.MstDeployPreset.ToListAsync();
        }

        public Task<MstDeployPreset> GetTrnDeployPreset(int id)
        {
            return DbContext.MstDeployPreset
                .IncludeAll()
                .Where(x => x.MstDeployPresetId == id)
                .FirstOrDefaultAsync();
        }
    }
}
