using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReimbursementTrackerApp.Models
{
    public class Tracking
    {
        [Key]
        public int TrackingId { get; set; }
        public int RequestId {  get; set; } //Foreign Key

        [ForeignKey("RequestId")]
        public Request? Request { get; set; }
        public string TrackingStatus { get; set;}
        public DateTime? ApprovalDate { get; set; }
        public DateTime? ReimbursementDate { get; set; }

    }
}
