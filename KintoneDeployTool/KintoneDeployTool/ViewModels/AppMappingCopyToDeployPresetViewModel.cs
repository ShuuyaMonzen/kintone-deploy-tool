using KintoneDeployTool.DataAccess.DomainModel;
using System.Collections.Generic;
using System.ComponentModel;

namespace KintoneDeployTool.ViewModels
{
    public class AppMappingCopyToDeployPresetViewModel : MstKintoneAppMapping
    {
        public static AppMappingCopyToDeployPresetViewModel Create(MstKintoneAppMapping mstKintoneAppMapping)
        {
            var vm = new AppMappingCopyToDeployPresetViewModel()
            {
                MstKintoneAppMappingID = mstKintoneAppMapping.MstKintoneAppMappingID,
                MstKintoneAppMappingName = mstKintoneAppMapping.MstKintoneAppMappingName,
                MstKintoneEnviromentID1 = mstKintoneAppMapping.MstKintoneEnviromentID1,
                MstKintoneEnviroment1 = mstKintoneAppMapping.MstKintoneEnviroment1,
                MstKintoneEnviromentID2 = mstKintoneAppMapping.MstKintoneEnviromentID2,
                MstKintoneEnviroment2 = mstKintoneAppMapping.MstKintoneEnviroment2,
                MstKintoneAppMappingDetails = mstKintoneAppMapping.MstKintoneAppMappingDetails,
                AppMappingCopyToDeployPresetDetails = new List<AppMappingCopyToDeployPresetDetail>()
            };

            mstKintoneAppMapping.MstKintoneAppMappingDetails.ForEach(x =>
            {
                vm.AppMappingCopyToDeployPresetDetails.Add(AppMappingCopyToDeployPresetDetail.Create(x));
            });

            return vm;
        }

        [DisplayName("デプロイ方向")]
        public bool IsDeployDirection2To1 { get; set; }

        public List<AppMappingCopyToDeployPresetDetail> AppMappingCopyToDeployPresetDetails { set; get; }
    }

    public class AppMappingCopyToDeployPresetDetail : MstKintoneAppMappingDetail
    {
        public static AppMappingCopyToDeployPresetDetail Create(MstKintoneAppMappingDetail mstKintoneAppMappingDetail)
        {
            return new AppMappingCopyToDeployPresetDetail()
            {
                MstKintoneAppMappingDetailID = mstKintoneAppMappingDetail.MstKintoneAppMappingDetailID,
                MstKintoneAppMappingID = mstKintoneAppMappingDetail.MstKintoneAppMappingID,
                MstKintoneAppMapping = mstKintoneAppMappingDetail.MstKintoneAppMapping,
                MstKintoneApp1 = mstKintoneAppMappingDetail.MstKintoneApp1,
                MstKintoneAppID1 = mstKintoneAppMappingDetail.MstKintoneAppID1,
                MstKintoneApp2 = mstKintoneAppMappingDetail.MstKintoneApp2,
                MstKintoneAppID2 = mstKintoneAppMappingDetail.MstKintoneAppID2,
                CreatedAt = mstKintoneAppMappingDetail.CreatedAt,
                UpdatedAt = mstKintoneAppMappingDetail.UpdatedAt,
                IsCopyTarget = false
            };
        }

        [DisplayName("デプロイ対象")]
        public bool IsCopyTarget { get; set; }
    }
}
