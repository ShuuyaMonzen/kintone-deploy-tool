using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KintoneDeployTool.DataAccess.DomainModel
{
    [Table("TrnActionLog")]
    public class TrnActionLog
    {
        [Key]
        [Required]
        [DisplayName("操作ログID")]
        public int TrnActionLogId { set; get; }

        [DisplayName("ステータス")]
        public int Status { set; get; }

        [DisplayName("操作名")]
        public string ActionName { set; get; }

        [DisplayName("エラーメッセージ")]
        public string ErrorMessage { set; get; }

        [DisplayName("操作日時")]
        public DateTime ActionDateTime { set; get; }

        [Required]
        [DisplayName("作成日時")]
        public DateTime CreatedAt { set; get; }

        [Required]
        [DisplayName("更新日時")]
        public DateTime UpdatedAt { set; get; }
    }
}
