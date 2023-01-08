using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KintoneDeployTool.DataAccess.DomainModel
{
    [Table("TrnDeployFromToInfo")]
    public class MstDeployFromToInfo
    {
        [Key]
        [Required]
        [DisplayName("デプロイFromTo情報ID")]
        public int MstDeployFromToInfoId { set; get; }

        [Required]
        [DisplayName("デプロイ情報プリセットID")]
        public int MstDeployPresetId { set; get; }

        [ForeignKey("TrnDeployPresetId")]
        public virtual MstDeployPreset MstDeployPreset { set; get; }

        [Required]
        [DisplayName("デプロイ元 KintoneアプリマスタID")]
        public int DeployFromMstKintoneAppID { set; get; }

        [ForeignKey("DeployFromMstKintoneAppID")]
        public virtual MstKintoneApp DeployFromMstKintoneApp { set; get; }

        [Required]
        [DisplayName("デプロイ先 KintoneアプリマスタID")]
        public int DeployToMstKintoneAppID { set; get; }

        [ForeignKey("DeployToMstKintoneAppID")]
        public virtual MstKintoneApp DeployToMstKintoneApp { set; get; }

        [Required]
        [DisplayName("作成日時")]
        public DateTime CreatedAt { set; get; }

        [Required]
        [DisplayName("更新日時")]
        public DateTime UpdatedAt { set; get; }

        
    }
}
