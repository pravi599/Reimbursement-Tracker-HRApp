using ReimbursementTrackerApp.Interfaces;
using ReimbursementTrackerApp.Models.DTOs;
using ReimbursementTrackerApp.Models;
using ReimbursementTrackerApp.Exceptions;

namespace ReimbursementTrackerApp.Services
{
    /// <summary>
    /// Service class for managing reimbursement request operations.
    /// </summary>
    public class RequestService : IRequestService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RequestService"/> class.
        /// </summary>
        /// <param name="requestRepository">Repository for reimbursement requests.</param>s
        /// <param name="trackingRepository">Repository for tracking information.</param>
        /// <param name="hostingEnvironment">Hosting environment for file operations.</param>
        private readonly IRepository<int, Request> _requestRepository;
        private readonly IRepository<int, Tracking> _trackingRepository;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public RequestService(
            IRepository<int, Request> requestRepository,
            IRepository<int, Tracking> trackingRepository,
            IWebHostEnvironment hostingEnvironment)
        {
            _requestRepository = requestRepository;
            _trackingRepository = trackingRepository;
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Adds a new reimbursement request and associated tracking information.
        /// </summary>
        /// <param name="requestDTO">DTO containing request information.</param>
        /// <returns>True if the addition is successful.</returns>
        public bool Add(RequestDTO requestDTO)
        {
            var documentPath = SaveDocument(requestDTO.Document);

            var request = new Request
            {
                ExpenseCategory = requestDTO.ExpenseCategory,
                Amount = requestDTO.Amount,
                Document = documentPath,
                Description = requestDTO.Description,
                RequestDate = DateTime.Now,
                Username = requestDTO.Username
            };

            _requestRepository.Add(request);

            var tracking = new Tracking
            {
                TrackingStatus = "Pending",
                ApprovalDate = null,
                ReimbursementDate = null,
                Request = request
            };

            _trackingRepository.Add(tracking);

            return true;
        }

        /// <summary>
        /// Private helper method to save documents associated with a request.
        /// </summary>
        /// <param name="document">Document file to be saved.</param>
        /// <returns>Path to the saved document.</returns>
        private string SaveDocument(IFormFile document)
        {
            if (document != null && document.Length > 0)
            {
                var uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "Documents");
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + document.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    document.CopyTo(stream);
                }

                return "https://localhost:7007/Documents/" + uniqueFileName;
            }

            return null;
        }

        /// <summary>
        /// Removes a reimbursement request based on the provided request ID.
        /// </summary>
        /// <param name="requestId">ID of the request to be removed.</param>
        /// <returns>True if the removal is successful.</returns>
        public bool Remove(int requestId)
        {
            var request = _requestRepository.Delete(requestId);

            if (request != null)
            {
                return true;
            }

            throw new RequestNotFoundException();
        }
        /// <summary>
        /// Updates an existing reimbursement request based on the provided DTO.
        /// </summary>
        /// <param name="requestDTO">DTO containing updated request information.</param>
        /// <returns>Updated request DTO.</returns>
        public RequestDTO Update(RequestDTO requestDTO)
        {
            var existingRequest = _requestRepository.GetById(requestDTO.RequestId);

            if (existingRequest != null)
            {
                existingRequest.ExpenseCategory = requestDTO.ExpenseCategory;
                existingRequest.Amount = requestDTO.Amount;
                existingRequest.Description = requestDTO.Description;
                existingRequest.RequestDate = requestDTO.RequestDate;


                // Update the document only if a new file is provided
                if (requestDTO.Document != null)
                {
                    var documentPath = SaveDocument(requestDTO.Document);
                    existingRequest.Document = documentPath;

                }

                _requestRepository.Update(existingRequest);

                return requestDTO;
            }

            throw new RequestNotFoundException();
        }

        /// <summary>
        /// Retrieves a reimbursement request DTO based on the provided request ID.
        /// </summary>
        /// <param name="requestId">ID of the requested reimbursement.</param>
        /// <returns>Request DTO if found.</returns>

        public RequestDTO GetRequestById(int requestId)
        {
            var existingRequest = _requestRepository.GetById(requestId);

            if (existingRequest != null)
            {
                var requestDto = new RequestDTO
                {
                    RequestId = existingRequest.RequestId,
                    Username = existingRequest.Username,
                    ExpenseCategory = existingRequest.ExpenseCategory,
                    Amount = existingRequest.Amount,
                    Description = existingRequest.Description,
                    RequestDate = existingRequest.RequestDate,
                    Document = GetDocumentAsFormFile(existingRequest.Document)
                };

                return requestDto;
            }

            throw new RequestNotFoundException();
        }

        /// <summary>
        /// Retrieves a reimbursement request based on the provided expense category.
        /// </summary>
        /// <param name="expenseCategory">Expense category of the requested reimbursement.</param>
        /// <returns>Requested reimbursement.</returns>
        public Request GetRequestsByCategory(string expenseCategory)
        {
            var existingRequest = _requestRepository.GetAll()
                .FirstOrDefault(r => r.ExpenseCategory == expenseCategory);

            if (existingRequest != null)
            {
                return new Request
                {
                    RequestId = existingRequest.RequestId,
                    ExpenseCategory = existingRequest.ExpenseCategory,
                    Amount = existingRequest.Amount,
                    Description = existingRequest.Description,
                    RequestDate = existingRequest.RequestDate,
                    Document = existingRequest.Document,
                    Username = existingRequest.Username
                };
            }

            throw new RequestNotFoundException();
        }

        /// <summary>
        /// Retrieves all reimbursement requests for a given username.
        /// </summary>
        /// <param name="username">Username of the requests to be retrieved.</param>
        /// <returns>Collection of reimbursement requests.</returns>
        public IEnumerable<Request> GetRequestsByUsername(string username)
        {
            var requests = _requestRepository.GetAll()
                .Where(r => r.Username == username);

            return requests.Select(existingRequest => new Request
            {
                RequestId = existingRequest.RequestId,
                ExpenseCategory = existingRequest.ExpenseCategory,
                Amount = existingRequest.Amount,
                Description = existingRequest.Description,
                RequestDate = existingRequest.RequestDate,
                Document = existingRequest.Document,
                Username = existingRequest.Username
            }).ToList();
        }

        /// <summary>
        /// Retrieves all reimbursement requests.
        /// </summary>
        /// <returns>Collection of all reimbursement requests.</returns>
        public IEnumerable<Request> GetAllRequests()
        {
            var requests = _requestRepository.GetAll();

            return requests.Select(existingRequest => new Request
            {
                RequestId = existingRequest.RequestId,
                ExpenseCategory = existingRequest.ExpenseCategory,
                Amount = existingRequest.Amount,
                Description = existingRequest.Description,
                RequestDate = existingRequest.RequestDate,
                Document = existingRequest.Document,
                Username = existingRequest.Username
            }).ToList();
        }

        /// <summary>
        /// Private helper method to get a document as an IFormFile.
        /// </summary>
        /// <param name="documentPath">Path to the document.</param>
        /// <returns>Document as IFormFile.</returns>
        private IFormFile GetDocumentAsFormFile(string documentPath)
        {
            try
            {
                if (!string.IsNullOrEmpty(documentPath))
                {
                    var imagePath = Path.Combine(_hostingEnvironment.WebRootPath, documentPath);

                    if (File.Exists(imagePath))
                    {
                        var fileBytes = File.ReadAllBytes(imagePath);
                        var memoryStream = new MemoryStream(fileBytes);
                        return new FormFile(memoryStream, 0, fileBytes.Length, "Document", Path.GetFileName(imagePath));
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading document: {ex.Message}");
            }

            return null;
        }

    }
}
