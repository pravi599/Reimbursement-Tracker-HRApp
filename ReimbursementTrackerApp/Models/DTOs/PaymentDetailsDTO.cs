namespace ReimbursementTrackerApp.Models.DTOs
{
    public class PaymentDetailsDTO
    {
        public int RequestId { get; set; }
        public int PaymentId { get; set; }
        public string BankAccountNumber { get; set; }
        public string IFSC { get; set; }
        public float PaymentAmount { get; set; }
        public DateTime PaymentDate { get; set; }


    }
}