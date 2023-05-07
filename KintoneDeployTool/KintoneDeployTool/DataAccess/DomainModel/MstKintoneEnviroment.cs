using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KintoneDeployTool.DataAccess.DomainModel
{
    [Table("MstKintoneEnviroment")]
    public class MstKintoneEnviroment
    {
        [Key]
        [Required]
        [DisplayName("Kintone環境ID")]
        public int MstKintoneEnviromentID { set; get; }

        [Required]
        [BindRequired]
        [DisplayName("環境名")]
        public string EnviromentName { set; get; }

        [Required]
        [BindRequired]
        [DisplayName("サブドメイン")]
        public string SubDomain { set; get; }

        [Required]
        [BindRequired]
        [DisplayName("ユーザーID")]
        public string UserID { set; get; }

        [Required]
        [BindRequired]
        [DisplayName("パスワード")]
        public string Password { set; get; }

        [Required]
        [DisplayName("作成日時")]
        public DateTime CreatedAt { set; get; }

        [Required]
        [DisplayName("更新日時")]
        public DateTime UpdatedAt { set; get; }

        public List<MstKintoneApp> MstKintoneApps { set; get; }
    }
}
