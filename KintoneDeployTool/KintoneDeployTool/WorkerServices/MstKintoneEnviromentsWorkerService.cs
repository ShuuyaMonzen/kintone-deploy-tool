using KintoneDeployTool.DataAccess.Repository;
using KintoneDeployTool.Manager;
using System.Linq;
using System.Threading.Tasks;

namespace KintoneDeployTool.WorkerServices
{
    public class MstKintoneEnviromentsWorkerService : BaseWorkerService
    {
        public KintoneAppRepository KintoneAppRepository { get; set; }
        public KintoneEnviromentRepository KintoneEnviromentRepository { get; set; }

        public MstKintoneEnviromentsWorkerService(KintoneAppRepository KintoneAppRepository, 
            KintoneEnviromentRepository KintoneEnviromentRepository)
        {
            this.KintoneAppRepository = KintoneAppRepository;
            this.KintoneEnviromentRepository = KintoneEnviromentRepository;
        }

        public async Task SyncMstKintoneApp()
        {
            var mstKintoneEnviroments = await KintoneEnviromentRepository.GetAllMstKintoneEnviroments();

            foreach(var mstKintoneEnviroment in mstKintoneEnviroments)
            {
                var mstKintoneApps = await KintoneRestApiManager.GetAppInfos(mstKintoneEnviroment);
                var addTargetMstKintoneApps = mstKintoneApps.Where(x =>
                    !(mstKintoneEnviroment.MstKintoneApps?.Where(y => y.AppId == x.AppId).Any() ?? false)).ToList();
                var updateTargetMstKintoneApps = mstKintoneApps.Where(x =>
                    (mstKintoneEnviroment.MstKintoneApps?.Where(y => y.AppId == x.AppId).Any() ?? false)).ToList();
                var deleteTargetMstKintoneApps = mstKintoneEnviroment.MstKintoneApps.Where(x =>
                    !(mstKintoneApps.Where(y => y.AppId == x.AppId).Any())).ToList();

                //マスタレコード追加
                addTargetMstKintoneApps.ForEach(x =>
                {
                    KintoneAppRepository.AddMstKintoneApp(x);
                });

                //マスタレコード更新
                updateTargetMstKintoneApps.ForEach(x =>
                {
                    var mstKintoneApp = mstKintoneEnviroment.MstKintoneApps.Where(y => y.AppId == x.AppId).First();
                    mstKintoneApp.AppName = x.AppName;
                    mstKintoneApp.SpaceId = x.SpaceId;
                });

                //マスタレコード削除
                deleteTargetMstKintoneApps.ForEach(x =>
                {
                    KintoneAppRepository.DeleteMstKintoneApp(x);
                });

            }

            KintoneAppRepository.SaveChanges();

        }

    }
}
