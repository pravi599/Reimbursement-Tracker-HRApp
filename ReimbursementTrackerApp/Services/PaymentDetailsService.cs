// PaymentDetailsService.cs
using ReimbursementTrackerApp.Interfaces;
using ReimbursementTrackerApp.Models;
using ReimbursementTrackerApp.Models.DTOs;
using ReimbursementTrackerApp.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ReimbursementTrackerApp.Services
{
    /// <summary>
    /// Service class for managing payment details related to reimbursement requests.
    /// </summary>
    public class PaymentDetailsService : IPaymentDetailsService
    {
        private readonly IRepository<int, PaymentDetails> _paymentDetailsRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="PaymentDetailsService"/> class.
        /// </summary>
        /// <param name="paymentDetailsRepository">The repository for payment details.</param>
        public PaymentDetailsService(IRepository<int, PaymentDetails> paymentDetailsRepository)
        {
            _paymentDetailsRepository = paymentDetailsRepository;
        }

        /// <summary>
        /// Adds a new payment detail entry.
        /// </summary>
        /// <param name="paymentDetailsDTO">The payment details to be added.</param>
        /// <returns>Returns true if the addition is successful; otherwise, throws a PaymentDetailsAlreadyExistsException.</returns>
        public bool Add(PaymentDetailsDTO paymentDetailsDTO)
        {
            var existingPaymentDetails = _paymentDetailsRepository.GetAll()
                .FirstOrDefault(pd => pd.PaymentId == paymentDetailsDTO.PaymentId);

            if (existingPaymentDetails == null)
            {
                var paymentDetails = new PaymentDetails
                {
                    RequestId = paymentDetailsDTO.RequestId,
                    PaymentAmount = paymentDetailsDTO.PaymentAmount,
                    PaymentDate = paymentDetailsDTO.PaymentDate,
                    BankAccountNumber = paymentDetailsDTO.BankAccountNumber,
                    IFSC = paymentDetailsDTO.IFSC,

                };

                _paymentDetailsRepository.Add(paymentDetails);

                return true;
            }

            throw new PaymentDetailsAlreadyExistsException();
        }

        /// <summary>
        /// Removes a payment detail entry based on the payment ID.
        /// </summary>
        /// <param name="paymentId">The ID of the payment details to be removed.</param>
        /// <returns>Returns true if the removal is successful; otherwise, throws a PaymentDetailsNotFoundException.</returns>
        public bool Remove(int paymentId)
        {
            var paymentDetails = _paymentDetailsRepository.Delete(paymentId);

            if (paymentDetails != null)
            {
                return true;
            }

            throw new PaymentDetailsNotFoundException();
        }

        /// <summary>
        /// Updates a payment detail entry based on the provided PaymentDetailsDTO.
        /// </summary>
        /// <param name="paymentDetailsDTO">Updated payment details information.</param>
        /// <returns>Returns the updated PaymentDetailsDTO if the update is successful; otherwise, throws a PaymentDetailsNotFoundException.</returns>
        public PaymentDetailsDTO Update(PaymentDetailsDTO paymentDetailsDTO)
        {
            var existingPaymentDetails = _paymentDetailsRepository.GetById(paymentDetailsDTO.PaymentId);

            if (existingPaymentDetails != null)
            {
                existingPaymentDetails.RequestId = paymentDetailsDTO.RequestId;
                existingPaymentDetails.PaymentAmount = paymentDetailsDTO.PaymentAmount;
                existingPaymentDetails.PaymentDate = paymentDetailsDTO.PaymentDate;
                existingPaymentDetails.BankAccountNumber = paymentDetailsDTO.BankAccountNumber;
                existingPaymentDetails.IFSC = paymentDetailsDTO.IFSC;


                _paymentDetailsRepository.Update(existingPaymentDetails);

                return new PaymentDetailsDTO
                {
                    PaymentId = existingPaymentDetails.PaymentId,
                    RequestId = existingPaymentDetails.RequestId,
                    PaymentAmount = existingPaymentDetails.PaymentAmount,
                    BankAccountNumber = existingPaymentDetails.BankAccountNumber,
                    IFSC = existingPaymentDetails.IFSC,

                    PaymentDate = existingPaymentDetails.PaymentDate
                };
            }

            throw new PaymentDetailsNotFoundException();
        }

        /// <summary>
        /// Gets payment details based on the payment ID.
        /// </summary>
        /// <param name="paymentId">The ID of the payment details to retrieve.</param>
        /// <returns>Returns the PaymentDetailsDTO if the payment details are found; otherwise, throws a PaymentDetailsNotFoundException.</returns>
        public PaymentDetailsDTO GetPaymentDetailsById(int paymentId)
        {
            var paymentDetails = _paymentDetailsRepository.GetById(paymentId);

            if (paymentDetails != null)
            {
                return new PaymentDetailsDTO
                {
                    PaymentId = paymentDetails.PaymentId,
                    RequestId = paymentDetails.RequestId,
                    PaymentAmount = paymentDetails.PaymentAmount,
                    BankAccountNumber = paymentDetails.BankAccountNumber,
                    IFSC = paymentDetails.IFSC,

                    PaymentDate = paymentDetails.PaymentDate
                };
            }

            throw new PaymentDetailsNotFoundException();
        }

        /// <summary>
        /// Gets all payment details.
        /// </summary>
        /// <returns>Returns a collection of PaymentDetailsDTO representing all payment details.</returns>
        public IEnumerable<PaymentDetailsDTO> GetAllPaymentDetails()
        {
            var paymentDetails = _paymentDetailsRepository.GetAll();

            return paymentDetails.Select(pd => new PaymentDetailsDTO
            {
                PaymentId = pd.PaymentId,
                RequestId = pd.RequestId,
                PaymentAmount = pd.PaymentAmount,
                BankAccountNumber = MaskBankAccountNumber(pd.BankAccountNumber), // Mask the credit card number
                IFSC = pd.IFSC,

                PaymentDate = pd.PaymentDate
            });
        }
        private string MaskBankAccountNumber(string BankAccountNumber)
        {
            // Implement your masking logic here (show only the last 4 digits, for example)
            // This is a simplified example, you might want to use a more secure masking method
            return "**** **** **** " + BankAccountNumber.Substring(BankAccountNumber.Length - 4);
        }

        // Helper method to mask the CVV
        private string MaskIFSC(string IFSC)
        {
            // Implement your masking logic for CVV (show only a portion)
            // This is a simplified example, you might want to use a more secure masking method
            return "****";
        }
    }
}