using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KintoneDeployTool.DataAccess.DomainModel
{
    [Table("MstKintoneApp")]
    public class MstKintoneApp
    {
        [Key]
        [Required]
        [DisplayName("KintoneアプリマスタID")]
        public int MstKintoneAppID { set; get; }

        [Required]
        [DisplayName("Kintone環境ID")]
        public int MstKintoneEnviromentID { set; get; }

        [ForeignKey("MstKintoneEnviromentID")]
        public MstKintoneEnviroment MstKintoneEnviroment { set; get; }

        [Required]
        [DisplayName("アプリID")]
        public int AppId { set; get; }

        [DisplayName("スペースID")]
        public int? SpaceId { set; get; }

        [Required]
        [DisplayName("アプリ名")]
        public string AppName { set; get; }

        [DisplayName("APIトークン")]
        public string ApiToken { set; get; }

        [DisplayName("削除フラグ")]
        public bool IsDeleted { set; get; }

        [Required]
        [DisplayName("作成日時")]
        public DateTime CreatedAt { set; get; }

        [Required]
        [DisplayName("更新日時")]
        public DateTime UpdatedAt { set; get; }
    }
}
