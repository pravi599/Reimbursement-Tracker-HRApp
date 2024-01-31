using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReimbursementTrackerApp.Models
{
    public class PaymentDetails
    {
        public int RequestId { get; set; }
        [Key]
        public int PaymentId { get; set; }
        public string BankAccountNumber { get; set; }
        public string IFSC { get; set; }
        public float PaymentAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        [ForeignKey("RequestId")]
        public Request? Request { get; set; }
    }

}