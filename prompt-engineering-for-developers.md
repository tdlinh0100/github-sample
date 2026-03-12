# Prompt Engineering Cho Developers: Từ Cơ Bản Đến Chuyên Nghiệp

---

## Slide 1 – Tại Sao Prompt Engineering Là Kỹ Năng Thiết Yếu Cho Developers Năm 2026?

• AI coding assistants (Claude Code, GitHub Copilot, Cursor, ChatGPT) đã trở thành công cụ chuẩn trong phát triển phần mềm
• Chất lượng prompt ảnh hưởng trực tiếp đến chất lượng code và năng suất làm việc
• Theo khảo sát từ GitHub (2025), developers giỏi prompt engineering đạt năng suất cao gấp 2-3 lần so với người dùng prompt mơ hồ
• Prompt tốt giúp giảm thời gian debug, số lần sửa code, và chi phí API
• Đây không còn là kỹ năng tùy chọn - đây là kỹ năng cốt lõi để làm việc hiệu quả với AI

---

## Slide 2 – Những Vấn Đề Developers Thường Gặp Khi Dùng AI

• **Kết quả không nhất quán**: Cùng một câu hỏi nhưng mỗi lần AI trả lời khác nhau
• **Code sai hoặc lỗi thời**: AI suggest API không tồn tại hoặc đã deprecated
• **Hallucination**: AI "bịa" ra thư viện, function, hoặc pattern không có thật
• **Thiếu context**: Code được generate không khớp với kiến trúc hiện tại
• **Over-engineering**: AI thêm quá nhiều tính năng không cần thiết
• **Vượt quá context window**: Codebase lớn làm AI bỏ sót thông tin quan trọng
• **Lãng phí thời gian**: Phải hỏi lại nhiều lần để được kết quả mong muốn

---

## Slide 3 – Tại Sao Prompt Yếu Dẫn Đến Output Tệ?

### 3 Lý Do Chính:

**1. AI Phải Đoán Khi Thiếu Thông Tin**
• Ví dụ: "Fix bug" → AI không biết bug gì, ở đâu, ngôn ngữ gì
• Kết quả: Phải hỏi lại 5 lần thay vì 1 lần
• Giải pháp: Cung cấp đầy đủ context ngay từ đầu

**2. Prompt Mơ Hồ Tạo Ra Nhiều Cách Hiểu**
• Ví dụ: "Làm code tốt hơn" → Tốt hơn về gì? Performance? Readability? Security?
• Kết quả: AI chọn random → 50% chance sai hướng
• Giải pháp: Nói rõ mục tiêu cụ thể

**3. Thiếu Context Dẫn Đến Giải Pháp Generic**
• Ví dụ: "Viết API endpoint" không nói framework
• Kết quả: AI suggest Express.js nhưng bạn dùng Fastify → Code không chạy được
• Giải pháp: Luôn mention tech stack và cấu trúc hiện tại

**💡 Điểm Mấu Chốt:** Prompt tốt = Ít đoán + Rõ ràng + Đủ context

---

## Slide 4 – Nguyên Tắc Cốt Lõi Của Prompt Chất Lượng Cao

### 1. Tính Cụ Thể (Specificity)
• Nói chính xác bạn muốn gì, không dùng từ mơ hồ

### 2. Ngữ Cảnh (Context)
• Phiên bản framework/thư viện, kiến trúc hiện tại, thông báo lỗi, stack traces

### 3. Ràng Buộc (Constraints)
• Yêu cầu về hiệu năng, bảo mật, phong cách code, những gì KHÔNG được làm

### 4. Ví Dụ (Examples)
• Few-shot prompting: cho AI thấy mẫu mong muốn từ codebase hiện tại

### 5. Định Dạng Đầu Ra (Output Format)
• Chỉ code? Có tests? Có tài liệu? Cấu trúc JSON?

### 6. Tiêu Chí Kiểm Tra (Verification Criteria)
• Làm sao biết kết quả đúng? Trường hợp biên nào cần xử lý?

**Lưu ý về độ dài prompt:**
- **Prompt dài (CTCO đầy đủ)**: Dùng cho complex tasks, critical code, first time với domain mới
- **Prompt ngắn (Quick format)**: Dùng cho simple tasks, familiar patterns, non-critical code
- **Rule of thumb**: Task >30 phút → Invest 5 phút viết prompt tốt; Task <10 phút → Quick prompt OK

---

## Slide 5 – Framework Thực Tế: CTCO (Context-Task-Constraints-Output)

```
CONTEXT: [Vai trò, môi trường, công nghệ sử dụng]
Bạn là senior TypeScript developer. Codebase dùng Next.js 14, Prisma, PostgreSQL.

TASK: [Nhiệm vụ cụ thể]
Viết API endpoint POST /api/users để tạo user mới.

CONSTRAINTS: [Ràng buộc]
- Validate email bằng Zod schema
- Hash password bằng bcrypt (cost factor 12)
- Trả về JWT token (15 phút hết hạn)
- Rate limiting: 5 requests/15 phút
- Tuân theo repository pattern trong /src/repositories/base.repository.ts
- KHÔNG dùng external OAuth providers

OUTPUT: [Định dạng mong muốn]
Trả về:
1. TypeScript interface cho request/response
2. Implementation với xử lý lỗi
3. Unit tests dùng Jest
4. Ví dụ cách gọi API
```

**Tại sao framework này hiệu quả?**
• Cấu trúc rõ ràng giúp AI tập trung đúng chỗ
• Giảm hallucination bằng cách neo trong ngữ cảnh cụ thể
• Ràng buộc ngăn AI làm quá hoặc sai hướng
• Định dạng đầu ra đảm bảo nhận được đúng những gì cần

---

## 🔄 Transition: Từ Lý Thuyết Đến Thực Hành

Bạn đã học:
✅ Tại sao prompt engineering quan trọng
✅ Các vấn đề phổ biến
✅ CTCO Framework

**Tiếp theo:** Xem các ví dụ thực tế Before/After để hiểu cách áp dụng

---


## Slide 6 – Trước vs Sau: Viết Code

### ❌ Prompt Sai:
```
Tạo function validate email
```

### ✅ Prompt Tốt:
```
Viết TypeScript function validateEmail() với yêu cầu:

YÊU CẦU:
- Input: string (địa chỉ email)
- Output: boolean (true nếu hợp lệ)
- Validate theo chuẩn RFC 5322
- Chấp nhận email có dấu + (vd: user+test@example.com)
- Từ chối email có khoảng trắng hoặc ký tự đặc biệt không hợp lệ

RÀNG BUỘC:
- Dùng regex pattern
- Không dùng thư viện bên ngoài
- Bao gồm JSDoc comments
- Export dưới dạng named export

ĐẦU RA:
- Triển khai function
- 5 test cases (3 hợp lệ, 2 không hợp lệ)
```

**Tại sao prompt này tốt hơn?**
• Chỉ rõ kiểu dữ liệu input/output
• Định nghĩa quy tắc validation cụ thể
• Nêu các trường hợp biên (dấu +, khoảng trắng)
• Ràng buộc về cách triển khai
• Yêu cầu tests để xác minh

---

## Slide 7 – Trước vs Sau: Debug Lỗi

### ❌ Prompt Sai:
```
Code tôi bị lỗi, fix giúp
```

### ✅ Prompt Tốt:
```
Debug lỗi TypeScript trong /src/api/orders.controller.ts:

THÔNG BÁO LỖI:
Type 'Promise<Order[]>' is not assignable to type 'Order[]'
at line 34: const orders: Order[] = await orderService.findAll()

CODE HIỆN TẠI:
async function getOrders(req: Request, res: Response) {
  const orders: Order[] = await orderService.findAll()
  res.json(orders)
}

NGỮ CẢNH:
- Framework: Express.js với TypeScript
- orderService.findAll() trả về Promise<Order[]> theo /src/services/order.service.ts
- Mong đợi: Function xử lý async đúng cách và trả về mảng orders

ĐÃ THỬ:
- Thêm try-catch nhưng vẫn lỗi type
- Xóa type annotation thì chạy nhưng mất type safety

Cần:
1. Giải thích tại sao lỗi này xảy ra
2. Sửa chính xác với typing đúng
3. Best practice cho async Express handlers
```

**Tại sao prompt này tốt hơn?**
• Thông báo lỗi đầy đủ + số dòng
• Đoạn code hiện tại
• Ngữ cảnh về framework và dependencies
• Những gì đã thử (tránh AI gợi ý lại)
• Yêu cầu giải thích + sửa + best practice

---

## Slide 8 – Trước vs Sau: Refactoring

### ❌ Prompt Sai:
```
Refactor code này cho đẹp hơn
```

### ✅ Prompt Tốt:
```
Refactor /src/utils/data-processor.ts để cải thiện khả năng bảo trì:

VẤN ĐỀ HIỆN TẠI:
- Function processData() dài 450 dòng, làm quá nhiều việc
- Nested if statements sâu 6 cấp
- Thay đổi input arrays trực tiếp (không immutable)
- Không có xử lý lỗi
- Các số ma thuật không có giải thích

MỤC TIÊU:
- Chia thành các functions nhỏ hơn (<50 dòng mỗi function)
- Tách validation, transformation, aggregation thành các functions riêng
- Dùng immutable patterns (map, filter, reduce thay vì mutations)
- Thêm try-catch với thông báo lỗi cụ thể
- Trích xuất các số ma thuật thành named constants

MẪU CẦN TUÂN THEO (từ /src/utils/validator.ts):
function validateAndTransform<T>(data: T[], validator: (item: T) => boolean): T[] {
  return data.filter(validator).map(item => ({ ...item }))
}

ĐẦU RA:
- Code đã refactor với tên function rõ ràng
- So sánh trước/sau
- Giải thích cho mỗi thay đổi quan trọng
```

**Tại sao prompt này tốt hơn?**
• Xác định các vấn đề cụ thể (không chỉ "cho đẹp hơn")
• Mục tiêu có thể đo lường (< 50 dòng, immutable, v.v.)
• Tham chiếu mẫu hiện có từ codebase
• Yêu cầu giải thích để học được cách tiếp cận

---

## Slide 9 – Trước vs Sau: Viết Tests

### ❌ Prompt Sai:
```
Viết tests cho user service
```

### ✅ Prompt Tốt:
```
Tạo tests toàn diện cho /src/services/user.service.ts:

CÁC METHODS CẦN TEST:
- createUser(data: CreateUserDto): Promise<User>
- updateUser(id: string, data: UpdateUserDto): Promise<User>
- deleteUser(id: string): Promise<void>
- findById(id: string): Promise<User | null>

YÊU CẦU TEST:
- Framework: Jest
- Mock các database calls bằng jest.mock()
- Tuân theo mẫu AAA (Arrange, Act, Assert)
- Mục tiêu coverage: 80%+

CÁC TEST CASES:
Trường hợp thành công:
- Tạo user với dữ liệu hợp lệ
- Cập nhật user hiện có
- Xóa user hiện có
- Tìm user bằng ID hợp lệ

Trường hợp biên:
- Tạo user với email trùng → throw ConflictError
- Cập nhật user với ID không hợp lệ → throw NotFoundError
- Xóa user không tồn tại → throw NotFoundError
- Tìm với ID null/undefined → return null

Trường hợp lỗi:
- Kết nối database thất bại → throw DatabaseError
- Validation thất bại → throw ValidationError

ĐẦU RA:
- File test: /src/services/__tests__/user.service.test.ts
- Logic setup/teardown nếu cần
- Mock implementations
```

**Tại sao prompt này tốt hơn?**
• Liệt kê cụ thể các methods cần test
• Định nghĩa test cases (happy path, trường hợp biên, lỗi)
• Chỉ định testing framework và patterns
• Mục tiêu coverage rõ ràng
• Vị trí file và cấu trúc

---

## Slide 10 – Trước vs Sau: Thiết Kế Kiến Trúc

### ❌ Prompt Sai:
```
Thiết kế hệ thống cache
```

### ✅ Prompt Tốt:
```
Thiết kế caching layer cho REST API với yêu cầu:

KIẾN TRÚC HIỆN TẠI:
- Express.js API trong /src/api
- PostgreSQL database qua Prisma ORM
- Services tuân theo repository pattern
- Thời gian phản hồi trung bình: 200ms (mục tiêu: <100ms)
- Lưu lượng: 1000 req/min peak

YÊU CẦU:
- Chỉ cache GET requests (không cache POST/PUT/DELETE)
- Dùng Redis (đã config trong /src/config/redis.ts)
- TTL: 5 phút cho list endpoints, 15 phút cho single resources
- Vô hiệu hóa cache khi có POST/PUT/DELETE tới related resources
- Thêm metrics: tỷ lệ cache hit/miss
- Tuân theo middleware pattern như /src/middleware/auth.ts

RÀNG BUỘC:
- Không thay đổi API contracts hiện có
- Tương thích ngược với clients hiện tại
- Phải xử lý lỗi kết nối Redis một cách graceful

ĐẦU RA:
1. Triển khai middleware với TypeScript
2. Chiến lược tạo cache key
3. Chiến lược vô hiệu hóa cache
4. Điểm tích hợp trong code hiện có
5. Cách tiếp cận monitoring/metrics
6. Xử lý lỗi cho Redis failures
```

**Tại sao prompt này tốt hơn?**
• Mô tả kiến trúc hiện tại và baseline hiệu năng
• Yêu cầu cụ thể về chiến lược caching
• Tham chiếu các patterns hiện có để duy trì tính nhất quán
• Ràng buộc về tương thích và xử lý lỗi
• Yêu cầu các deliverables cụ thể

---

## 🔄 Transition: Từ Examples Đến Best Practices

Bạn đã thấy 5 ví dụ Before/After cơ bản.

**Tiếp theo:** Học cách tránh những lỗi phổ biến và kỹ thuật nâng cao

---


## Slide 11 – 7 Lỗi Prompt Phổ Biến Nhất

### Lỗi 1: Quá Mơ Hồ
❌ "Làm code này tốt hơn"
✅ "Refactor để giảm cyclomatic complexity xuống dưới 10 và extract repeated logic thành reusable functions"

### Lỗi 2: Thiếu Context
❌ "Fix bug này: [code]"
✅ "Fix bug trong React 18 component dùng TypeScript. Error: 'Cannot read property of undefined'. Expected: component render user data từ API."

### Lỗi 3: Hỏi Quá Nhiều Cùng Lúc
❌ "Build full-stack app với auth, payments, admin dashboard, và deploy"
✅ Chia thành 10+ prompts tập trung, mỗi prompt xử lý 1 feature

### Lỗi 4: Không Chỉ Định Định Dạng Đầu Ra
❌ "Analyze code này"
✅ "Phân tích và trả về: 1) Danh sách bugs với số dòng, 2) Vấn đề bảo mật với mức độ nghiêm trọng, 3) Điểm nghẽn hiệu năng với metrics"

### Lỗi 5: Không Đưa Ra Ví Dụ
❌ "Viết function theo pattern của chúng ta"
✅ "Viết function theo pattern này: [paste example code từ codebase]"

### Lỗi 6: Bỏ Qua Ngữ Cảnh Lỗi Khi Debug
❌ "Code không chạy"
✅ "Lỗi: [full stack trace], Môi trường: [details], Thay đổi gần đây: [commits], Đã thử: [attempts]"

### Lỗi 7: Kỳ Vọng Không Thực Tế
❌ "Viết toàn bộ backend trong 1 prompt"
✅ Chia nhỏ: API design → Database schema → Endpoints → Tests → Documentation

---

## Slide 12A – Kỹ Thuật Prompt Cơ Bản

### 1. Role Prompting (Định Nghĩa Vai Trò)
**Khi nào dùng:** Review chuyên sâu, các quyết định kiến trúc

**Ví dụ:**
```
Bạn là staff engineer tại FAANG company với 10 năm kinh nghiệm distributed systems.
Review kiến trúc microservices này cho: điểm nghẽn về khả năng mở rộng, điểm lỗi đơn,
vấn đề tính nhất quán dữ liệu. Hãy phê bình và cụ thể.
```

**Tại sao hiệu quả:** AI sẽ áp dụng patterns và best practices từ role được chỉ định

### 2. Chain of Thought (Suy Luận Từng Bước)
**Khi nào dùng:** Debug phức tạp, bài toán nhiều bước

**Ví dụ:**
```
Debug React component bị infinite re-render.

Suy nghĩ từng bước:
1. Xác định tất cả useEffect dependencies
2. Kiểm tra việc tạo lại object/array
3. Theo dõi chuỗi cập nhật state
4. Giải thích tại sao infinite loop xảy ra
5. Đưa ra cách sửa với giải thích

[Component code]
```

**Tại sao hiệu quả:** Buộc AI phải reasoning thay vì đoán, giảm hallucination

---

## Slide 12B – Kỹ Thuật Prompt Nâng Cao

### 3. Few-Shot Prompting (Học Từ Ví Dụ)
**Khi nào dùng:** Khớp patterns, đảm bảo tính nhất quán

**Ví dụ:**
```
Chuyển đổi ngôn ngữ tự nhiên sang SQL. Ví dụ:

Input: "Hiển thị users đăng ký tuần trước"
Output: SELECT * FROM users WHERE created_at >= NOW() - INTERVAL '7 days';

Input: "Đếm active subscriptions theo plan"
Output: SELECT plan_type, COUNT(*) FROM subscriptions WHERE status = 'active' GROUP BY plan_type;

Bây giờ chuyển đổi: "Tìm users với >5 orders trong tháng qua"
```

**Tại sao hiệu quả:** AI học pattern từ examples, output consistent hơn

### 4. Iterative Refinement (Cải Tiến Dần)
**Khi nào dùng:** Tính năng phức tạp, học hỏi

**Ví dụ:**
```
Vòng 1: "Tạo REST API endpoint cho user registration"
Vòng 2: "Thêm validation dùng Zod, hash passwords với bcrypt, trả về JWT"
Vòng 3: "Thêm xử lý lỗi cho duplicate emails, rate limiting, email verification"
Vòng 4: "Thêm database transaction, tối ưu hiệu năng, thêm logging"
```

**Tại sao hiệu quả:** Chia nhỏ complexity, dễ debug và adjust

### 5. Self-Critique (Tự Phê Bình)
**Khi nào dùng:** Đảm bảo chất lượng, trước khi deploy

**Ví dụ:**
```
Bước 1: "Viết caching layer cho API responses"
Bước 2: "Review code vừa viết. Xác định: race conditions, memory leaks,
         vấn đề cache invalidation, thiếu xử lý lỗi"
Bước 3: "Sửa các issues vừa xác định, ưu tiên mức độ CRITICAL và HIGH"
```

**Tại sao hiệu quả:** AI tự review và improve, quality cao hơn

### Ma Trận Quyết Định: Khi Nào Dùng Technique Nào?

| Tình Huống | Technique Nên Dùng |
|------------|-------------------|
| Architecture review | Role Prompting |
| Complex bug | Chain of Thought |
| Generate consistent code | Few-Shot |
| Large feature | Iterative Refinement |
| Production code | Self-Critique |

---

## Slide 13 – Debug Với AI: Templates Thực Tế

### Template 1: Phân Tích Stack Trace
```
Phân tích lỗi này và xác định nguyên nhân gốc rễ:

LỖI:
[YOUR_STACK_TRACE]

NGỮ CẢNH:
- Framework: [YOUR_FRAMEWORK] [YOUR_VERSION]
- Đang làm gì: [YOUR_USER_ACTION]
- Thay đổi gần đây: [YOUR_RECENT_CHANGES]
- Môi trường: [YOUR_ENVIRONMENT]

ĐÃ THỬ:
- [YOUR_ATTEMPT_1]
- [YOUR_ATTEMPT_2]

Cung cấp:
1. Giải thích nguyên nhân gốc rễ
2. Cách sửa từng bước
3. Chiến lược phòng ngừa
```

### Template 2: Hành Vi Không Mong Đợi
```
Debug hành vi không mong đợi:

MONG ĐỢI: [YOUR_EXPECTED_BEHAVIOR]
THỰC TẾ: [YOUR_ACTUAL_BEHAVIOR]

CODE:
[YOUR_CODE]

LOGS:
[YOUR_LOGS]

MÔI TRƯỜNG:
- OS: [YOUR_OS]
- Runtime: [YOUR_RUNTIME] [YOUR_VERSION]
- Dependencies: [YOUR_DEPENDENCIES]

Giúp tôi:
1. Xác định tại sao điều này xảy ra
2. Đề xuất cách sửa với ví dụ code
3. Khuyến nghị tests để ngăn regression
```

### Template 3: Vấn Đề Hiệu Năng
```
Tối ưu hóa thao tác chậm:

VẤN ĐỀ:
- Thao tác: [YOUR_SLOW_OPERATION]
- Hiệu năng hiện tại: [YOUR_CURRENT_METRICS]
- Hiệu năng mục tiêu: [YOUR_TARGET_METRICS]

CODE:
[YOUR_CODE]

DỮ LIỆU PROFILING:
[YOUR_PROFILER_OUTPUT]

Phân tích và cung cấp:
1. Các điểm nghẽn hiệu năng
2. Chiến lược tối ưu hóa
3. Thay đổi code với metrics trước/sau
4. Trade-offs của mỗi cách tiếp cận
```

---

## Slide 14 – Ví Dụ Quy Trình Thực Tế Của Developer

### Kịch Bản: Triển Khai Tính Năng User Authentication

**Vòng 1 - Lập Kế Hoạch:**
```
Prompt: "Tôi cần thêm user authentication. Stack hiện tại: Next.js 14, Prisma, PostgreSQL.
         Đề xuất cách tiếp cận triển khai."

Phản Hồi AI: [Cung cấp tổng quan kiến trúc: chiến lược JWT, bcrypt hashing, middleware pattern]
```

**Vòng 2 - Bắt Đầu Triển Khai:**
```
Prompt: "Triển khai bước 1: Tạo User model và database schema.
         Tuân theo Prisma schema pattern trong /prisma/schema.prisma.
         Bao gồm: id, email (unique), password (hashed), createdAt, updatedAt."

Phản Hồi AI: [Tạo Prisma schema]
```

**Vòng 3 - Gặp Trở Ngại:**
```
Prompt: "Đang triển khai password hashing, nhưng bcrypt.hash() trả về Promise.
         Gặp lỗi TypeScript: Type 'Promise<string>' not assignable to 'string'.
         Code hiện tại: [paste code]
         Làm sao sửa?"

Phản Hồi AI: [Giải thích async/await, cung cấp code đã sửa]
```

**Vòng 4 - Cải Thiện Triển Khai:**
```
Prompt: "Auth hoạt động rồi! Review triển khai cho các vấn đề bảo mật:
         [paste auth code]
         Kiểm tra: SQL injection, timing attacks, weak hashing, thiếu validation."

Phản Hồi AI: [Security review với các khuyến nghị cụ thể]
```

**Vòng 5 - Thêm Tests:**
```
Prompt: "Tạo tests cho auth system. Bao gồm:
         - Đăng ký/đăng nhập thành công
         - Xử lý email trùng
         - Thông tin đăng nhập không hợp lệ
         - Xác thực JWT token
         Dùng Jest, mock database calls."

Phản Hồi AI: [Bộ test hoàn chỉnh]
```

**Kết quả:** Tính năng hoàn thành với chất lượng cao, bảo mật đảm bảo, có tests, trong thời gian ngắn hơn nhiều so với làm từ đầu.

---

## Slide 15 – Templates Prompt Có Thể Tái Sử Dụng

### Template 1: Viết Code
```
Viết [function/component/class] để:

YÊU CẦU:
- [YOUR_REQUIREMENT_1]
- [YOUR_REQUIREMENT_2]

RÀNG BUỘC:
- Ngôn ngữ: [YOUR_LANGUAGE]
- Phong cách: [YOUR_STYLE]
- Hiệu năng: [YOUR_PERFORMANCE]
- Dependencies: [YOUR_DEPENDENCIES]

NGỮ CẢNH:
[YOUR_CONTEXT_CODE]

Bao gồm:
- Định nghĩa types
- Xử lý lỗi
- Ví dụ unit test
- JSDoc comments
```

### Template 2: Code Review
```
Review code này cho:

CODE:
[YOUR_CODE]

CÁC KHÍA CẠNH CẦN TẬP TRUNG:
- [ ] Lỗ hổng bảo mật
- [ ] Vấn đề hiệu năng
- [ ] Code smells
- [ ] Best practices
- [ ] Test coverage
- [ ] Xử lý lỗi

NGỮ CẢNH:
- Xử lý: [YOUR_DESCRIPTION]
- Dùng trong: [YOUR_ENVIRONMENT]
- Yêu cầu hiệu năng: [YOUR_SLA]

Cung cấp:
1. Vấn đề nghiêm trọng (phải sửa)
2. Đề xuất (nên sửa)
3. Nitpicks (tốt nếu có)
```

### Template 3: Refactoring
```
Refactor code để cải thiện [YOUR_GOAL]:

CODE HIỆN TẠI:
[YOUR_CODE]

VẤN ĐỀ:
- [YOUR_ISSUE_1]
- [YOUR_ISSUE_2]
- [YOUR_ISSUE_3]

MỤC TIÊU:
- [YOUR_TARGET_1]
- [YOUR_TARGET_2]

RÀNG BUỘC:
- Duy trì tương thích ngược
- Giữ nguyên API surface hiện có
- Không thêm dependencies mới

Cung cấp:
1. Code đã refactor
2. Giải thích các thay đổi
3. Hướng dẫn migration nếu cần
```

### Template 4: Thiết Kế Kiến Trúc
```
Thiết kế kiến trúc cho:

TÍNH NĂNG: [YOUR_FEATURE]

YÊU CẦU:
- Chức năng: [YOUR_FUNCTIONAL_REQUIREMENTS]
- Phi chức năng: [YOUR_NON_FUNCTIONAL_REQUIREMENTS]
- Quy mô: [YOUR_SCALE]

RÀNG BUỘC:
- Tech stack: [YOUR_TECH_STACK]
- Timeline: [YOUR_DEADLINE]
- Quy mô team: [YOUR_TEAM_SIZE]

HỆ THỐNG HIỆN TẠI:
[YOUR_CURRENT_SYSTEM]

Cung cấp:
1. Sơ đồ kiến trúc (text/ASCII)
2. Phân tích components
3. Luồng dữ liệu
4. Lựa chọn công nghệ với lý do
5. Chiến lược migration
6. Rủi ro và cách giảm thiểu
```

### Template 5: Debugging
```
Debug vấn đề này:

VẤN ĐỀ: [YOUR_PROBLEM]

LỖI:
[YOUR_ERROR_MESSAGE]

CODE:
[YOUR_CODE]

MÔI TRƯỜNG:
- [YOUR_ENVIRONMENT]

ĐÃ THỬ:
- [YOUR_ATTEMPT_1]
- [YOUR_ATTEMPT_2]

Cần:
1. Phân tích nguyên nhân gốc rễ
2. Cách sửa từng bước
3. Chiến lược phòng ngừa
4. Các vấn đề liên quan cần kiểm tra
```

---

## Slide 16 – Prompt Checklist: Dùng Hàng Ngày

### Trước Khi Gửi Prompt, Kiểm Tra:

**☐ Ngữ cảnh đầy đủ?**
- Phiên bản framework/thư viện?
- Kiến trúc hiện tại?
- Thông báo lỗi/stack traces?

**☐ Nhiệm vụ rõ ràng?**
- Hành động cụ thể, không mơ hồ?
- Kết quả có thể đo lường?

**☐ Ràng buộc được định nghĩa?**
- Yêu cầu về hiệu năng?
- Cân nhắc về bảo mật?
- Sở thích về phong cách code?
- Những gì KHÔNG được làm?

**☐ Ví dụ được cung cấp?**
- Tham chiếu code từ codebase?
- Mẫu mong muốn?

**☐ Định dạng đầu ra được chỉ định?**
- Chỉ code? Có tests? Có docs?
- Cấu trúc cụ thể?

**☐ Tiêu chí xác minh?**
- Làm sao biết kết quả đúng?
- Trường hợp biên nào cần xử lý?

**☐ Phạm vi hợp lý?**
- Có quá nhiều trong 1 prompt?
- Nên chia nhỏ hơn?

### Tự Kiểm Tra Nhanh:
"Nếu tôi gửi prompt này cho junior developer, họ có đủ thông tin để làm đúng không?"

Nếu KHÔNG → Prompt cần cải thiện.

---


## Slide 16A – Mẹo Sử Dụng Từng Tool

### 🛠️ Chọn Tool Phù Hợp Cho Từng Task

**Claude Code (Tốt nhất cho: Kiến Trúc & Suy Luận Phức Tạp)**
✅ Điểm Mạnh:
- Context window dài (200K tokens)
- Reasoning xuất sắc cho các quyết định kiến trúc
- Mạnh về hiểu các codebase lớn
- Tốt nhất cho refactoring và system design

💡 Mẹo:
- Paste toàn bộ file để có đầy đủ context
- Yêu cầu phân tích trade-offs
- Dùng cho các vấn đề debugging phức tạp
- Rất tốt cho câu hỏi "giải thích codebase này"

**GitHub Copilot (Tốt nhất cho: Autocomplete & Boilerplate)**
✅ Điểm Mạnh:
- Gợi ý inline nhanh
- Tốt cho code lặp đi lặp lại
- Học từ patterns trong codebase của bạn
- Xuất sắc cho các thao tác CRUD

💡 Mẹo:
- Viết tên function rõ ràng → gợi ý tốt hơn
- Thêm comments phía trên function để cung cấp context
- Dùng để tạo test boilerplate
- Rất tốt cho các task "viết code tương tự"

**Cursor (Tốt nhất cho: Thay Đổi Toàn Codebase)**
✅ Điểm Mạnh:
- Chỉnh sửa nhiều file cùng lúc
- Tìm kiếm và hiểu codebase
- Refactoring xuyên suốt các file
- Tốt cho migrations

💡 Mẹo:
- Dùng để đổi tên xuyên suốt các file
- Dùng để cập nhật patterns (ví dụ: API v1 → v2)
- Rất tốt cho "cập nhật tất cả file sử dụng X"
- Xuất sắc cho việc nâng cấp dependencies

**ChatGPT (Tốt nhất cho: Học Hỏi & Khám Phá)**
✅ Điểm Mạnh:
- Giải thích chi tiết
- Dạy các khái niệm từng bước
- Khám phá nhiều cách tiếp cận
- Tốt cho research

💡 Mẹo:
- Đặt câu hỏi "tại sao" và "làm thế nào"
- Yêu cầu nhiều cách tiếp cận giải quyết vấn đề
- Dùng để học các công nghệ mới
- Rất tốt cho câu hỏi "giải thích đơn giản như cho người mới"

### 📊 Ma Trận Quyết Định:

| Tác Vụ | Tool Tốt Nhất | Lý Do |
|--------|--------------|--------|
| Viết tính năng mới | Claude Code | Suy luận sâu, kiến trúc |
| Tự động hoàn thành code | Copilot | Gợi ý inline nhanh |
| Refactor xuyên suốt files | Cursor | Chỉnh sửa nhiều file |
| Học khái niệm mới | ChatGPT | Giải thích chi tiết |
| Debug vấn đề phức tạp | Claude Code | Context dài, suy luận |
| Tạo boilerplate | Copilot | Khớp patterns |
| Đổi tên biến khắp nơi | Cursor | Tìm kiếm toàn codebase |
| Khám phá trade-offs | Claude Code | Phân tích & suy luận |

### 💡 Mẹo Nâng Cao: Kết Hợp Các Tools
```
1. ChatGPT: Học khái niệm
2. Claude Code: Thiết kế kiến trúc
3. Copilot: Viết boilerplate
4. Cursor: Refactor xuyên suốt files
5. Claude Code: Review và tối ưu cuối cùng
```

---

## 🔄 Transition: Từ Tools Đến Advanced Examples

Bạn đã có:
✅ Templates tái sử dụng
✅ Checklists
✅ Tool-specific tips

**Tiếp theo:** Xem các ví dụ chi tiết cho scenarios phức tạp

---

## Slide 19 – Ví Dụ Điển Hình 1: Tạo API Endpoint

### ❌ Prompt Sai - Quá Chung Chung:
```
Tạo API để lấy danh sách sản phẩm
```

**Vấn đề:**
• Không rõ framework nào
• Không biết cấu trúc response
• Không có pagination
• Không có filtering
• Không có error handling
• AI sẽ phải đoán → kết quả không như mong muốn

### ✅ Prompt Đúng - Cụ Thể Chi Tiết:
```
Tạo API endpoint GET /api/products để lấy danh sách sản phẩm:

NGỮ CẢNH:
- Framework: Express.js với TypeScript
- Database: PostgreSQL qua Prisma ORM
- Cấu trúc hiện tại: /src/api/routes/, /src/services/, /src/models/

YÊU CẦU CHỨC NĂNG:
- Pagination: query params ?page=1&limit=20 (mặc định limit=20, max=100)
- Filtering: ?category=electronics&minPrice=100&maxPrice=1000
- Sorting: ?sortBy=price&order=asc (mặc định: createdAt desc)
- Search: ?search=laptop (tìm trong name và description)

RESPONSE FORMAT:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "price": number,
      "category": "string",
      "stock": number,
      "createdAt": "ISO date"
    }
  ],
  "meta": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}

XỬ LÝ LỖI:
- 400: Invalid query parameters (vd: page < 1, limit > 100)
- 500: Database connection error

RÀNG BUỘC:
- Validate tất cả query params bằng Zod
- Sử dụng Prisma để query database
- Thêm index trên category và price columns
- Response time phải < 200ms với 1000 records

ĐẦU RA:
1. Route handler trong /src/api/routes/products.ts
2. Service logic trong /src/services/product.service.ts
3. Zod validation schema
4. Ví dụ cURL request
```

**Tại sao prompt này tốt hơn?**
• Chỉ rõ framework và tech stack
• Định nghĩa đầy đủ các tính năng (pagination, filtering, sorting, search)
• Cấu trúc response rõ ràng với types
• Xử lý lỗi cụ thể
• Ràng buộc về hiệu năng
• Tổ chức code theo cấu trúc dự án

---

## Slide 20 – Ví Dụ Điển Hình 2: Fix Bug React Component

### ❌ Prompt Sai - Thiếu Thông Tin:
```
Component này bị lỗi, sửa giúp tôi:

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [user]);

  return <div>{user?.name}</div>;
}
```

**Vấn đề:**
• Không mô tả lỗi gì đang xảy ra
• Không có error message
• Không biết expected behavior
• Không có context về fetchUser function
• AI có thể sửa sai chỗ hoặc không hiểu vấn đề

### ✅ Prompt Đúng - Mô Tả Đầy Đủ:
```
Debug React component bị infinite re-render:

TRIỆU CHỨNG:
- Browser bị treo sau vài giây
- Console log hiển thị hàng nghìn lần "Fetching user..."
- Network tab cho thấy API được gọi liên tục
- CPU usage lên 100%

CODE HIỆN TẠI:
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Fetching user...');
    fetchUser(userId).then(setUser);
  }, [user]); // ← Nghi ngờ vấn đề ở đây

  return <div>{user?.name}</div>;
}

NGỮ CẢNH:
- React 18.2.0
- fetchUser là async function trả về Promise<User>
- Component được render khi userId thay đổi
- Mong đợi: Chỉ fetch 1 lần khi userId thay đổi

ĐÃ THỬ:
- Thêm empty dependency array [] → user không update
- Bỏ dependency array → warning từ ESLint
- Thêm userId vào deps → vẫn infinite loop

CẦN:
1. Giải thích TẠI SAO infinite loop xảy ra (cơ chế React)
2. Sửa chính xác với giải thích từng bước
3. Best practice cho data fetching trong React
4. Cách tránh lỗi tương tự trong tương lai
```

**Tại sao prompt này tốt hơn?**
• Mô tả triệu chứng cụ thể (infinite loop, CPU 100%)
• Có code đầy đủ với comment chỉ nghi ngờ
• Context về React version và fetchUser
• Liệt kê những gì đã thử (tránh AI suggest lại)
• Yêu cầu giải thích cơ chế, không chỉ fix
• Hỏi về best practice để học thêm

---

## Slide 21 – Ví Dụ Điển Hình 3: Tối Ưu Hóa Database Query

### ❌ Prompt Sai - Không Có Metrics:
```
Query này chậm, tối ưu giúp tôi:

SELECT * FROM orders
WHERE user_id = 123
```

**Vấn đề:**
• Không biết "chậm" là bao nhiêu giây
• Không có execution plan
• Không biết số lượng records
• Không có thông tin về indexes
• Không biết mục tiêu hiệu năng
• AI không thể đưa ra giải pháp phù hợp

### ✅ Prompt Đúng - Có Dữ Liệu Cụ Thể:
```
Tối ưu hóa slow database query:

QUERY HIỆN TẠI:
SELECT * FROM orders
WHERE user_id = 123
  AND status = 'completed'
  AND created_at >= '2026-01-01'
ORDER BY created_at DESC;

HIỆU NĂNG HIỆN TẠI:
- Execution time: 3.2 giây
- Rows scanned: 5,000,000
- Rows returned: 150
- Query được gọi: 500 lần/phút

EXPLAIN ANALYZE OUTPUT:
Seq Scan on orders  (cost=0.00..85430.50 rows=150 width=200) (actual time=3200.000..3200.500 rows=150 loops=1)
  Filter: ((user_id = 123) AND (status = 'completed') AND (created_at >= '2026-01-01'))
  Rows Removed by Filter: 4999850

DATABASE INFO:
- PostgreSQL 15
- Table size: 5 triệu rows, 2GB
- Indexes hiện có: PRIMARY KEY (id)
- Không có index trên user_id, status, created_at

MỤC TIÊU:
- Giảm execution time xuống < 100ms
- Giảm rows scanned
- Không thay đổi query logic

RÀNG BUỘC:
- Không được thay đổi schema (thêm/xóa columns)
- Có thể thêm indexes
- Có thể rewrite query

CẦN:
1. Phân tích tại sao query chậm (sequential scan)
2. Đề xuất indexes cụ thể với lý do
3. Rewrite query nếu cần
4. Ước tính hiệu năng sau khi tối ưu
5. Trade-offs của mỗi giải pháp (write performance, storage)
```

**Tại sao prompt này tốt hơn?**
• Có metrics cụ thể (3.2s, 5M rows scanned)
• Có EXPLAIN ANALYZE output (quan trọng!)
• Thông tin về database và table size
• Mục tiêu rõ ràng (< 100ms)
• Ràng buộc về schema changes
• Yêu cầu phân tích trade-offs

---

## Slide 22 – Ví Dụ Điển Hình 4: Viết Unit Tests

### ❌ Prompt Sai - Không Có Test Cases:
```
Viết tests cho function này:

function calculateDiscount(price, couponCode) {
  // logic here
  return discountedPrice;
}
```

**Vấn đề:**
• Không thấy implementation bên trong
• Không biết business rules
• Không biết edge cases nào cần test
• Không biết testing framework
• AI sẽ viết tests generic, thiếu coverage

### ✅ Prompt Đúng - Định Nghĩa Test Cases:
```
Viết comprehensive unit tests cho discount calculation function:

FUNCTION CẦN TEST:
function calculateDiscount(price: number, couponCode: string): number {
  if (price < 0) throw new Error('Price cannot be negative');
  if (!couponCode) return price;

  const coupon = COUPONS[couponCode];
  if (!coupon) return price;
  if (coupon.expired) return price;

  if (coupon.type === 'percentage') {
    const discount = price * (coupon.value / 100);
    return price - Math.min(discount, coupon.maxDiscount || Infinity);
  }

  if (coupon.type === 'fixed') {
    return Math.max(0, price - coupon.value);
  }

  return price;
}

BUSINESS RULES:
- Percentage coupons: giảm X%, tối đa maxDiscount
- Fixed coupons: giảm số tiền cố định
- Expired coupons: không áp dụng
- Invalid coupon codes: trả về giá gốc
- Giá âm: throw error
- Giá sau giảm không được < 0

TEST CASES CẦN COVER:

Trường Hợp Thành Công:
- Percentage coupon hợp lệ: price=1000, code="SAVE20" (20%) → 800
- Fixed coupon hợp lệ: price=1000, code="SAVE100" → 900
- Percentage với maxDiscount: price=1000, code="SAVE50" (50%, max=300) → 700

Trường Hợp Biên:
- Không có coupon code: price=1000, code="" → 1000
- Coupon không tồn tại: price=1000, code="INVALID" → 1000
- Coupon đã hết hạn: price=1000, code="EXPIRED20" → 1000
- Fixed coupon > price: price=50, code="SAVE100" → 0 (không âm)
- Price = 0: price=0, code="SAVE20" → 0
- Percentage = 100%: price=1000, code="FREE" (100%) → 0

Trường Hợp Lỗi:
- Price âm: price=-100, code="SAVE20" → throw Error
- Price = null/undefined → throw Error
- CouponCode = null → return price

YÊU CẦU:
- Framework: Jest
- Coverage target: 100%
- Mock COUPONS object
- Sử dụng describe/it structure
- Mỗi test case phải có mô tả rõ ràng
- Nhóm tests theo category (happy path, trường hợp biên, lỗi)

ĐẦU RA:
- File: calculateDiscount.test.ts
- Setup mock data
- Tất cả test cases trên
- Assertions rõ ràng với expected values
```

**Tại sao prompt này tốt hơn?**
• Có full implementation để hiểu logic
• Business rules được giải thích rõ
• Test cases cụ thể với input/output mong đợi
• Phân loại tests (happy path, trường hợp biên, lỗi)
• Coverage target rõ ràng (100%)
• Yêu cầu về structure và organization

---

## Slide 23 – Ví Dụ Điển Hình 5: Code Review

### ❌ Prompt Sai - Quá Chung Chung:
```
Review code này:

[paste 500 lines of code]
```

**Vấn đề:**
• Quá nhiều code, AI không biết focus vào đâu
• Không có context về mục đích
• Không biết cần review khía cạnh nào
• Kết quả sẽ generic và bỏ sót issues quan trọng

### ✅ Prompt Đúng - Focus Và Có Ưu Tiên:
```
Code review cho authentication middleware:

CODE:
// /src/middleware/auth.ts
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

NGỮ CẢNH:
- Middleware này bảo vệ tất cả protected routes
- Được dùng trong production với 10,000 users
- Xử lý ~1000 requests/phút
- Critical cho security

CÁC KHÍA CẠNH CẦN TẬP TRUNG (ƯU TIÊN):

🔴 CRITICAL (phải sửa ngay):
- [ ] Lỗ hổng bảo mật (JWT validation, injection attacks)
- [ ] Khả năng bypass authentication
- [ ] Lộ thông tin nhạy cảm trong error messages
- [ ] Thiếu rate limiting

🟡 HIGH (nên sửa):
- [ ] Xử lý lỗi không đầy đủ
- [ ] Vấn đề hiệu năng (database query trong mỗi request)
- [ ] Thiếu logging cho security events
- [ ] Không xử lý expired tokens đúng cách

🟢 MEDIUM (tốt nếu có):
- [ ] Tổ chức code và khả năng đọc
- [ ] TypeScript types có thể cải thiện
- [ ] Thiếu comments cho logic phức tạp
- [ ] Không có unit tests

CÂU HỎI:
1. JWT_SECRET có được lưu trữ an toàn không?
2. Token expiry có được kiểm tra không?
3. Có cần thêm refresh token mechanism?
4. Database query có được cache không?

ĐẦU RA:
Cho mỗi issue tìm thấy:
1. Mức độ nghiêm trọng (CRITICAL/HIGH/MEDIUM)
2. Dòng code cụ thể
3. Giải thích vấn đề
4. Code fix cụ thể
5. Test case để verify fix

Ưu tiên CRITICAL trước, sau đó HIGH, cuối cùng MEDIUM.
```

**Tại sao prompt này tốt hơn?**
• Code ngắn gọn, focused (không paste 500 dòng)
• Context về mục đích và tầm quan trọng
• Các khía cạnh được ưu tiên rõ ràng (CRITICAL/HIGH/MEDIUM)
• Câu hỏi cụ thể để AI suy nghĩ sâu hơn
• Yêu cầu output có cấu trúc với severity levels
• Ưu tiên security vì đây là auth middleware

---

## Slide 24 – Ví Dụ Điển Hình 6: Refactor Legacy Code

### ❌ Prompt Sai - Không Có Mục Tiêu:
```
Refactor code này cho clean hơn:

[paste messy code]
```

**Vấn đề:**
• "Clean hơn" quá mơ hồ
• Không biết vấn đề cụ thể là gì
• Không có mục tiêu đo lường được
• AI có thể refactor theo hướng không mong muốn

### ✅ Prompt Đúng - Mục Tiêu Cụ Thể:
```
Refactor legacy data processing function:

CODE HIỆN TẠI:
function processUserData(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].age >= 18) {
      if (data[i].country === 'VN') {
        if (data[i].status === 'active') {
          let user = data[i];
          user.fullName = user.firstName + ' ' + user.lastName;
          user.isAdult = true;
          user.region = 'Southeast Asia';
          result.push(user);
        }
      }
    }
  }
  return result;
}

VẤN ĐỀ CỤ THỂ:
1. Nested if statements 3 cấp (khó đọc)
2. Thay đổi input data trực tiếp (user.fullName = ...)
3. Giá trị ma thuật ('VN', 'active', 18)
4. Không có type safety
5. Không có xử lý lỗi
6. Tên biến không rõ nghĩa (data, result)
7. Imperative style (for loop) thay vì declarative

MỤC TIÊU REFACTOR:
1. Giảm nesting xuống 1 cấp
2. Immutable: không thay đổi input
3. Trích xuất giá trị ma thuật thành constants
4. Thêm TypeScript types
5. Thêm xử lý lỗi cho invalid data
6. Tên biến mô tả rõ ràng
7. Functional style (filter, map)
8. Tách logic thành smaller functions

RÀNG BUỘC:
- Phải giữ nguyên output (tương thích ngược)
- Không thay đổi performance đáng kể
- Phải có unit tests cho refactored code

MẪU MONG MUỐN:
// Ví dụ từ codebase hiện tại
const ADULT_AGE = 18;
const ACTIVE_STATUS = 'active';

function isEligibleUser(user: User): boolean {
  return user.age >= ADULT_AGE
    && user.country === Country.VN
    && user.status === ACTIVE_STATUS;
}

ĐẦU RA:
1. Code đã refactor với TypeScript
2. Định nghĩa constants
3. Helper functions
4. So sánh trước/sau (side by side)
5. Giải thích mỗi cải tiến
6. Unit tests cho refactored version
```

**Tại sao prompt này tốt hơn?**
• Liệt kê cụ thể 7 vấn đề cần fix
• Mục tiêu refactor rõ ràng và đo lường được
• Ràng buộc về tương thích ngược
• Có mẫu mong muốn từ codebase
• Yêu cầu so sánh trước/sau
• Yêu cầu tests để đảm bảo không break

---

## Slide 25 – Ví Dụ Điển Hình 7: Debug Production Error

### ❌ Prompt Sai - Thiếu Context:
```
Lỗi này trong production, fix gấp:

Error: Cannot read property 'map' of undefined
```

**Vấn đề:**
• Chỉ có error message, không có stack trace
• Không biết code nào gây lỗi
• Không có context về khi nào lỗi xảy ra
• Không có logs
• AI không thể diagnose chính xác

### ✅ Prompt Đúng - Full Context:
```
Debug critical production error:

MỨC ĐỘ: CRITICAL - Ảnh hưởng 30% users
TẦN SUẤT: 150 lỗi/phút
BẮT ĐẦU: 2026-03-11 10:30 AM (sau deploy v2.3.0)

THÔNG BÁO LỖI:
TypeError: Cannot read property 'map' of undefined
    at ProductList.render (ProductList.tsx:45:23)
    at renderWithHooks (react-dom.js:...)
    at updateFunctionComponent (react-dom.js:...)

FULL STACK TRACE:
[paste complete stack trace]

CODE TẠI DÒNG 45:
// ProductList.tsx
function ProductList({ categoryId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts(categoryId).then(setProducts);
  }, [categoryId]);

  return (
    <div>
      {products.map(product => (  // ← Dòng 45: Lỗi ở đây
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

LOGS:
[10:30:15] API /api/products?category=123 → 200 OK
[10:30:15] Response: { success: true, data: null }  ← Chú ý: data = null
[10:30:16] Error: Cannot read property 'map' of undefined

THAY ĐỔI GẦN ĐÂY (v2.3.0):
- Thay đổi API response format
- Trước: { products: [...] }
- Sau: { success: true, data: [...] }
- Backend đã update, frontend chưa update hết

MÔI TRƯỜNG:
- React 18.2.0
- Production build
- Browser: Chrome 120, Safari 17
- Chỉ xảy ra với một số categories cụ thể

ĐÃ THỬ:
- Rollback về v2.2.0 → lỗi biến mất
- Kiểm tra API response → trả về data: null với empty categories
- Kiểm tra code → products.map() giả định products luôn là array

CẦN:
1. Phân tích nguyên nhân gốc rễ (tại sao products = undefined?)
2. Fix ngay lập tức để deploy (hotfix)
3. Giải pháp dài hạn (xử lý lỗi đúng cách)
4. Ngăn chặn tương tự trong tương lai
5. Test cases để bắt lỗi này trước khi deploy
```

**Tại sao prompt này tốt hơn?**
• Mức độ nghiêm trọng và tác động rõ ràng (CRITICAL, 30% users)
• Full stack trace, không chỉ error message
• Code context với line number chính xác
• Logs cho thấy API response (data: null)
• Thay đổi gần đây giúp xác định root cause
• Những gì đã thử (rollback worked)
• Yêu cầu cả immediate fix và long-term solution

---

## Slide 26 – Ví Dụ Điển Hình 8: Thiết Kế System Architecture

### ❌ Prompt Sai - Quá Rộng:
```
Thiết kế hệ thống real-time chat
```

**Vấn đề:**
• Quá rộng, không có requirements cụ thể
• Không biết quy mô (10 users hay 10M users?)
• Không biết features nào cần
• Không có constraints về tech stack
• AI sẽ đưa ra giải pháp generic

### ✅ Prompt Đúng - Requirements Chi Tiết:
```
Thiết kế kiến trúc cho real-time chat application:

YÊU CẦU NGHIỆP VỤ:
- Chat 1-1 và group chat (max 100 members/group)
- Text messages, hình ảnh, files (max 10MB)
- Typing indicators và read receipts
- Push notifications

YÊU CẦU QUY MÔ:
- 10,000 concurrent users (mục tiêu 50K trong 1 năm)
- 1000 messages/giây peak
- Message delivery latency: < 1000ms (p95)
- Uptime: 99.9%

RÀNG BUỘC:
- Backend: Node.js, Database: PostgreSQL, Cloud: AWS
- Ngân sách: $5000/tháng
- Team: 3 backend devs, 2 frontend devs

HẠ TẦNG HIỆN CÓ:
- User authentication (JWT), File storage (S3), Push notifications (FCM)

THÁCH THỨC:
1. Xử lý concurrent WebSocket connections
2. Message delivery khi user offline
3. Chiến lược mở rộng theo chiều ngang

DELIVERABLES:
1. Sơ đồ kiến trúc (ASCII format)
2. WebSocket vs alternatives - lựa chọn và tại sao
3. Database schema
4. Kế hoạch mở rộng (Scalability plan)
5. Phân tích chi phí
```

**Tại sao prompt này tốt hơn?**
• Requirements cụ thể với metrics (10K users, 1000 msg/s)
• Ràng buộc tech stack và budget rõ ràng
• Tận dụng hạ tầng hiện có
• Tập trung vào 3 thách thức chính
• 5 deliverables cốt lõi (thay vì 10)

---

## Slide 27 – Ví Dụ Điển Hình 9: Hiểu Legacy Code Không Có Docs

### ❌ Prompt Sai - Không Có Context:
```
Code này làm gì?

[paste 200 lines of mysterious code]
```

**Vấn đề:**
• Quá nhiều code, AI không biết focus vào đâu
• Không có context về business logic
• Không biết tại sao cần hiểu code này
• Không có thông tin về tech stack
• AI sẽ cho explanation generic

### ✅ Prompt Đúng - Context Đầy Đủ:
```
Giải thích legacy code này để tôi có thể maintain:

CODE:
function processOrder(o, u, p) {
  const d = new Date();
  const x = o.items.reduce((a, i) => a + i.p * i.q, 0);

  if (u.t === 'P' && x > 1000) {
    x *= 0.9;
  }

  const r = {
    id: genId(),
    uid: u.id,
    t: x,
    s: x > 500 ? 'pending' : 'approved',
    c: d.toISOString(),
    m: p
  };

  db.insert('orders', r);
  sendEmail(u.email, 'order', r);

  if (r.s === 'pending') {
    queue.push({ type: 'review', data: r });
  }

  return r;
}

NGỮ CẢNH:
- Code từ 5 năm trước, không có documentation
- Developer gốc đã nghỉ việc
- Đang có bug: một số orders không được approve
- Tech stack: Node.js, MongoDB
- Function này được gọi từ checkout API

TẠI SAO CẦN HIỂU:
- Cần fix bug về order approval logic
- Cần thêm feature: support multiple payment methods
- Cần refactor để dễ maintain

CẦN:
1. Giải thích chi tiết function làm gì (từng bước)
2. Ý nghĩa của các biến viết tắt (o, u, p, x, r, t, s, c, m)
3. Business logic ẩn (tại sao 'P' user được giảm 10%? Tại sao >500 cần pending?)
4. Potential bugs (có race conditions? validation issues?)
5. Flow diagram (text format)
6. Đề xuất refactoring để code rõ ràng hơn
7. Nơi nên thêm tests
8. Dependencies cần chú ý (db, queue, sendEmail)
```

**Tại sao prompt này tốt hơn?**
• Context về lịch sử code (5 năm trước, no docs)
• Lý do cần hiểu (fix bug, thêm feature)
• Tech stack rõ ràng
• Yêu cầu giải thích chi tiết từng phần
• Hỏi về business logic ẩn
• Yêu cầu identify potential bugs
• Đề xuất refactoring path

---

## Slide 28 – Ví Dụ Điển Hình 10: Tích Hợp API Bên Thứ Ba

### ❌ Prompt Sai - Thiếu Requirements:
```
Tích hợp Stripe payment vào app
```

**Vấn đề:**
• Không rõ integrate vào đâu
• Không biết features nào cần
• Không có error handling requirements
• Không biết testing strategy
• AI sẽ cho basic example không production-ready

### ✅ Prompt Đúng - Requirements Chi Tiết:
```
Tích hợp Stripe payment vào checkout flow:

DỰ ÁN HIỆN TẠI:
- Framework: Next.js 14 (App Router)
- Frontend: /app/checkout/page.tsx
- Backend API: /app/api/
- Database: PostgreSQL với Prisma
- Auth: NextAuth.js

YÊU CẦU TÍCH HỢP:
1. Accept credit/debit cards
2. Lưu payment methods cho future use
3. Handle webhooks cho payment confirmation
4. Support refunds
5. Hiển thị payment history

FLOW MONG MUỐN:
1. User nhập card info trên checkout page
2. Frontend gọi API tạo payment intent
3. Stripe process payment
4. Webhook confirm payment
5. Update order status trong database
6. Gửi email confirmation
7. Redirect user đến success page

XỬ LÝ LỖI:
- Card declined → hiển thị error, cho phép retry
- Network timeout → retry với exponential backoff
- Webhook failed → queue để retry
- Duplicate payments → idempotency check

BẢO MẬT:
- Không lưu card numbers
- Sử dụng Stripe Elements (PCI compliant)
- Verify webhook signatures
- HTTPS only

TESTING:
- Test mode với test cards
- Mock webhooks trong development
- Integration tests cho payment flow

CẦN:
1. Frontend component với Stripe Elements
2. API endpoint: POST /api/create-payment-intent
3. API endpoint: POST /api/webhooks/stripe
4. Database schema cho payments table
5. Error handling code
6. Webhook signature verification
7. Test setup instructions
8. Environment variables cần thiết
9. Ví dụ test với test cards
```

**Tại sao prompt này tốt hơn?**
• Mô tả dự án hiện tại rõ ràng
• Requirements đầy đủ (5 features)
• Flow chi tiết từng bước
• Error handling cho mọi trường hợp
• Security requirements cụ thể
• Testing strategy rõ ràng
• Deliverables cụ thể (9 items)

---

## Slide 29 – Ví Dụ Điển Hình 11: Setup CI/CD Pipeline

### ❌ Prompt Sai - Quá Chung Chung:
```
Tạo GitHub Actions cho project
```

**Vấn đề:**
• Không biết project type
• Không biết steps nào cần
• Không biết deploy target
• Không có testing requirements
• AI sẽ cho generic workflow

### ✅ Prompt Đúng - Specifications Đầy Đủ:
```
Tạo GitHub Actions CI/CD pipeline:

PROJECT INFO:
- Type: Node.js TypeScript API
- Framework: Express.js
- Package manager: pnpm
- Node version: 20.x
- Tests: Jest (unit + integration)
- Linting: ESLint + Prettier
- Database: PostgreSQL (migrations với Prisma)

WORKFLOW REQUIREMENTS:

**Khi Có Pull Request:**
1. Cài đặt dependencies (với cache)
2. Chạy linting (ESLint + Prettier check)
3. Kiểm tra type (tsc --noEmit)
4. Chạy unit tests với coverage (min 80%)
5. Chạy integration tests
6. Build project
7. Comment report coverage vào PR

**Khi Push Lên Main:**
1. Tất cả các bước từ PR
2. Build Docker image
3. Push image lên AWS ECR
4. Deploy lên staging environment (AWS ECS)
5. Chạy smoke tests trên staging
6. Thông báo Slack channel

**Khi Có Tag (v*.*.*):**
1. Tất cả các bước từ main
2. Deploy lên production environment
3. Tạo GitHub release với changelog
4. Thông báo Slack với release notes

XỬ LÝ LỖI:
- Dừng ngay nếu tests fail
- Retry deploy nếu network error (max 3 lần)
- Rollback nếu smoke tests fail
- Cảnh báo team nếu production deploy fail

SECRETS CẦN THIẾT:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- DATABASE_URL (staging & production)
- SLACK_WEBHOOK_URL

TỐI ƯU HÓA:
- Cache node_modules
- Cache Docker layers
- Parallel jobs khi có thể
- Bỏ qua CI cho các thay đổi chỉ có docs

CẦN:
1. .github/workflows/ci.yml
2. .github/workflows/deploy-staging.yml
3. .github/workflows/deploy-production.yml
4. Dockerfile (nếu chưa có)
5. docker-compose.yml cho local testing
6. Scripts: test.sh, build.sh, deploy.sh
7. Documentation: CI/CD setup guide
```

**Tại sao prompt này tốt hơn?**
• Project info đầy đủ (tech stack, versions)
• Workflow requirements cho 3 tình huống (PR, main, tag)
• Error handling và retry logic
• Danh sách secrets đầy đủ
• Chiến lược tối ưu hóa
• Deliverables cụ thể (7 files)

---

## 🔄 Transition: Từ Examples Đến Production Readiness

Bạn đã thấy nhiều ví dụ chi tiết.

**Tiếp theo:** Học cách xử lý edge cases, optimize costs, và ensure security

---


## Slide 30 – Khi Nào AI Thất Bại Và Cách Xử Lý

### Dấu Hiệu AI Đang Hallucinate:

**1. API/Method Không Tồn Tại**
```
// AI suggest method không tồn tại:
await prisma.user.findByEmail('test@example.com')
// ❌ Prisma không có findByEmail, chỉ có findUnique

// Đúng:
await prisma.user.findUnique({
  where: { email: 'test@example.com' }
})
```
**Cách verify:** Check official Prisma docs

**Lưu ý:** Prisma v2.20.0+ hỗ trợ `orderBy` trong `include`:
```typescript
// ✅ Valid syntax từ Prisma v2.20.0+:
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      orderBy: { createdAt: 'desc' }  // ✅ Supported
    }
  }
});
```

**2. Syntax Sai Với Version**
```
// AI suggest cho React 18:
componentWillMount() {  // ← Deprecated!
  this.fetchData();
}
```
**Cách verify:** Check React version và lifecycle methods

**3. Giải Pháp Quá Phức Tạp**
```
// Vấn đề: Tìm max trong array
// AI suggest: Implement quicksort rồi lấy phần tử cuối
// Thực tế: Math.max(...array) là đủ
```

### Cách Xử Lý Khi AI Sai:

**1. Thêm Version Constraints**
```
❌ "Viết React component với hooks"
✅ "Viết React 18.2 component với hooks. Chỉ dùng APIs có trong React 18.2 official docs."
```

**2. Yêu Cầu AI Verify**
```
"Trước khi suggest code, verify rằng API này tồn tại trong [library] version [X.Y.Z].
Cite official documentation."
```

**3. Break Down Thành Smaller Prompts**
```
❌ "Build toàn bộ authentication system"
✅
  Prompt 1: "Design database schema cho users table"
  Prompt 2: "Implement password hashing với bcrypt"
  Prompt 3: "Create JWT token generation"
  ...
```

**4. Kiểm Tra Chéo Với Tài Liệu Chính Thức**
- Luôn verify critical code với tài liệu chính thức
- Đặc biệt quan trọng cho: security, database, payment

**5. Dùng AI Model Khác**
- Nếu model A cho kết quả sai, thử model B
- So sánh kết quả từ nhiều models

### Prompt Để Verify:
```
Verify thông tin này:

CLAIM: [AI's suggestion]

QUESTIONS:
1. API/method này có tồn tại trong [library] [version] không?
2. Syntax có đúng không?
3. Có cách đơn giản hơn không?
4. Có security issues không?
5. Performance implications?

Cite official documentation cho mỗi câu trả lời.
```

---

## Slide 31 – Tối Ưu Chi Phí & Sử Dụng Token

### Hiểu Giới Hạn Token:

**Giới Hạn Thông Thường:**
- Claude Sonnet: 200K tokens context
- GPT-4: 128K tokens context
- 1 token ≈ 4 characters (tiếng Anh)
- 1 token ≈ 2-3 characters (tiếng Việt)

### Chiến Lược Tiết Kiệm Tokens:

**1. Paste Chỉ Code Liên Quan**
```
❌ Paste toàn bộ file 500 dòng
✅ Paste 20 dòng xung quanh issue + context
```

**2. Sử dụng Summaries**
```
❌ Paste 10 files để AI hiểu codebase
✅ "Codebase structure:
    - /api: Express routes
    - /services: Business logic
    - /models: Prisma schemas
    Now, help me with [specific issue]"
```

**3. Reuse Context**
```
// Lần 1: Gửi full context
"Context: [full project info]
Task: Create user endpoint"

// Lần 2: Reference context trước
"Using same context from previous conversation,
now create product endpoint"
```

**4. Batch Similar Requests**
```
❌ 5 prompts riêng cho 5 functions tương tự
✅ 1 prompt: "Create 5 CRUD endpoints following this pattern: [example]"
```

**5. Dùng Models Rẻ Hơn Cho Tác Vụ Đơn Giản**
```
// Tác vụ đơn giản → Haiku/GPT-3.5 (rẻ hơn)
- Định dạng code
- Tạo boilerplate
- Refactoring đơn giản

// Tác vụ phức tạp → Sonnet/GPT-4 (đắt hơn)
- Thiết kế kiến trúc
- Debugging phức tạp
- Đánh giá bảo mật
```

### Checklist Tối Ưu Chi Phí:

**☐ Có thể dùng model rẻ hơn không?**
- Haiku: $0.25/M input tokens
- Sonnet: $3/M input tokens
- Opus: $15/M input tokens
*(Giá tham khảo tại tháng 3/2026, kiểm tra pricing page để cập nhật)*

**☐ Có thể giảm context không?**
- Paste chỉ code liên quan
- Tóm tắt thay vì paste đầy đủ

**☐ Có thể batch requests không?**
- Gộp nhiều tasks tương tự

**☐ Có thể cache responses không?**
- Lưu các prompts & responses thường dùng

**☐ Có thể dùng templates không?**
- Tái sử dụng các prompts đã được chứng minh hiệu quả

### Ước Tính Chi Phí:

**Ví dụ: Debug session**
```
Input: 2000 tokens (code + context)
Output: 500 tokens (explanation + fix)

Với Sonnet:
- Input: 2000 * $3/1M = $0.006
- Output: 500 * $15/1M = $0.0075
- Total: ~$0.014 per request

Nếu debug 20 lần/ngày:
- Daily: $0.28
- Monthly: ~$8.40
```

**💡 Context để hiểu giá:**
• $8.40/tháng = 1 ly cà phê/tuần
• Tiết kiệm được 2-3 giờ/tuần = ~$200-300 value (với $100/giờ)
• ROI: ~2500% (tiết kiệm $300, chi $8.40)

**Mẹo:**
- Theo dõi mức sử dụng qua API dashboards
- Thiết lập cảnh báo ngân sách
- Xem xét các prompts tốn kém hàng tháng
- Tối ưu các prompts được dùng thường xuyên

---

## Slide 32 – Tham Khảo Nhanh: Cheat Sheet Prompts

### Debug Nhanh (< 2 phút):
```
Debug [error message]

CODE: [10-20 dòng xung quanh issue]
FRAMEWORK: [name + version]
EXPECTED: [behavior mong đợi]
```

### Refactor Nhanh (< 3 phút):
```
Refactor để fix: [vấn đề cụ thể]

CODE: [function cần refactor]
KEEP: [constraints - backward compatible, no new deps]
PATTERN: [example từ codebase]
```

### Test Nhanh (< 3 phút):
```
Write tests for [function name]

COVER: happy path, edge cases, errors
FRAMEWORK: Jest
TARGET: 80%+ coverage
```

### Code Review Nhanh (< 5 phút):
```
Review for security & performance:

CODE: [paste code]
FOCUS: CRITICAL issues only
CONTEXT: [production/staging, traffic level]
```

### API Endpoint Nhanh (< 5 phút):
```
Create [METHOD] [endpoint]

FRAMEWORK: [Express/Next.js/etc]
INPUT: [request format]
OUTPUT: [response format]
VALIDATION: [Zod/Joi/etc]
```

### Giải Thích Code Nhanh (< 2 phút):
```
Explain what this does:

CODE: [paste mysterious code]
CONTEXT: [tech stack]
NEED: high-level overview + potential issues
```

### Tối Ưu Query Nhanh (< 5 phút):
```
Optimize slow query:

QUERY: [SQL/Prisma query]
CURRENT: [execution time]
TARGET: [goal time]
DATABASE: [PostgreSQL/MySQL/etc + version]
```

---

## Slide 33 – Checklist Cuối Cùng: Trước Khi Gửi Prompt

### ✅ Checklist 30 Giây:

**1. Context đủ chưa?**
- [ ] Framework + version?
- [ ] Tech stack?
- [ ] Error messages (nếu debug)?

**2. Task rõ chưa?**
- [ ] Động từ hành động cụ thể?
- [ ] Kết quả mong đợi?

**3. Constraints có chưa?**
- [ ] Performance requirements?
- [ ] Security considerations?
- [ ] Backward compatibility?

**4. Output format chỉ định chưa?**
- [ ] Code only? Code + tests? Code + docs?

**5. Có thể ngắn hơn không?**
- [ ] Paste chỉ relevant code?
- [ ] Bỏ phần không cần thiết?

### 🎯 Golden Rule:

**"Nếu tôi gửi prompt này cho junior developer, họ có đủ thông tin để làm đúng không?"**

- ✅ CÓ → Prompt tốt, gửi đi
- ❌ KHÔNG → Thêm context, làm rõ requirements

### ⚡ Quick Wins:

**Thay vì:**
- "Fix bug này"
- "Làm code clean hơn"
- "Tối ưu performance"

**Hãy nói:**
- "Fix [error message]. Expected: [behavior]. Code: [snippet]"
- "Refactor để giảm nesting xuống 2 cấp và extract magic numbers"
- "Giảm query time từ 3s xuống <100ms bằng cách thêm indexes"

---

## Slide 34 – Các Nguyên Tắc Bảo Mật Cơ Bản: Dùng AI An Toàn

### 🔒 3 Quy Tắc Vàng:

**1. Redact Trước Khi Paste**
```typescript
// ❌ KHÔNG:
const config = {
  apiKey: 'sk-proj-abc123xyz789',
  dbUrl: 'postgresql://admin:P@ssw0rd@prod.db.company.com'
}

// ✅ ĐÚNG:
const config = {
  apiKey: process.env.API_KEY,  // Redacted
  dbUrl: process.env.DATABASE_URL  // Redacted
}
// Context: "API key từ OpenAI, DB là PostgreSQL"
```

**2. Review Code Do AI Tạo Ra**
```markdown
Checklist trước khi run:
- [ ] Không có SQL injection? (dùng parameterized queries)
- [ ] Không có command injection? (validate inputs)
- [ ] Không có XSS? (sanitize HTML)
- [ ] Validate user input đúng cách?
- [ ] Error messages không tiết lộ thông tin nhạy cảm?
```

**3. Biết Khi Nào KHÔNG Dùng AI**
❌ Không bao giờ dùng AI trực tiếp cho:
- Authentication & authorization
- Payment processing
- Cryptography
- Security configurations

✅ Dùng AI cho:
- Boilerplate code
- Refactoring
- Documentation
- Test generation
→ Nhưng LUÔN review kỹ

### 📋 Checklist Bảo Mật Trước Khi Paste:

**Trước khi paste vào AI:**
- [ ] Không có API keys, passwords, tokens?
- [ ] Không có customer PII (emails, phones)?
- [ ] Không có proprietary algorithms?
- [ ] Chính sách công ty cho phép sử dụng AI?

**Sau khi nhận code từ AI:**
- [ ] Kiểm tra các lỗ hổng bảo mật
- [ ] Test với malicious inputs
- [ ] Validate tất cả input của người dùng
- [ ] Kiểm tra error handling

### 🚨 Ví Dụ: SQL Injection

**❌ AI suggest (nguy hiểm):**
```typescript
const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
db.query(query);  // ← SQL Injection!
```

**✅ After review (an toàn):**
```typescript
const id = parseInt(req.params.id);
if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

const query = 'SELECT * FROM users WHERE id = $1';
db.query(query, [id]);  // ✅ Parameterized query
```

### 💡 Điểm Mấu Chốt:
**AI là assistant, không phải security expert. Bạn là người chịu trách nhiệm cuối cùng.**

---

## Slide 35 – Tuân Thủ & Chính Sách Công Ty

### 📜 Phân Loại Dữ Liệu:

| Mức Độ | Sử Dụng AI | Ví Dụ |
|---------|------------|-------|
| **Public** | ✅ OK | Code nguồn mở, tài liệu công khai |
| **Internal** | ⚠️ Kiểm tra chính sách | Công cụ nội bộ, code không nhạy cảm |
| **Confidential** | ❌ Chỉ self-hosted | Business logic, algorithms |
| **Restricted** | ❌ KHÔNG DÙNG AI | PII, dữ liệu y tế, thông tin thanh toán |

### 🏢 Quy Tắc Theo Từng Ngành:

**Healthcare (HIPAA):**
- ❌ Không paste PHI (Protected Health Information)
- ✅ Dùng placeholders: `patient_id="[REDACTED]"`

**Finance (SOX, PCI-DSS):**
- ❌ Không paste payment data, financial records
- ✅ Cần security audit cho AI-generated payment code

**EU (GDPR):**
- ❌ Không paste personal data của EU citizens
- ✅ Data minimization: paste minimum cần thiết

**Government:**
- ❌ Không dùng public AI cho classified data
- ✅ FedRAMP-compliant AI only

### ✅ Quy Trình An Toàn:

**Bước 1: Phân Loại Dữ Liệu**
→ Public/Internal/Confidential/Restricted?

**Bước 2: Kiểm Tra Chính Sách**
→ Công ty có cho phép dùng AI với phân loại này không?

**Bước 3: Ẩn Thông Tin Nhạy Cảm Nếu Cần**
→ Xóa tất cả dữ liệu nhạy cảm

**Bước 4: Sử Dụng AI**
→ Paste code đã được ẩn thông tin nhạy cảm

**Bước 5: Kiểm Tra Kết Quả**
→ Kiểm tra bảo mật + tuân thủ quy định

**Bước 6: Ghi Lại Tài Liệu**
→ Lưu vết kiểm toán cho các ngành được quản lý

### 🚨 Khi Nào Cần Dừng Lại & Hỏi:
- Không chắc về phân loại dữ liệu
- Code xử lý dữ liệu khách hàng
- Ngành được quản lý (healthcare, finance)
- Chính sách công ty không rõ ràng

**💡 Khi nghi ngờ → Hỏi security/legal team**

### 📚 Resources:
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP LLM Top 10: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Chính sách bảo mật công ty (kiểm tra tài liệu nội bộ)

---

## Tổng Kết & Hành Động Tiếp Theo

### 🎓 Những Gì Bạn Đã Học:

**Foundations (Slides 1-5):**
- Tại sao prompt engineering quan trọng
- Vấn đề developers thường gặp
- Nguyên tắc cốt lõi
- CTCO Framework

**Practical Examples (Slides 6-26):**
- 21 ví dụ thực tế với before/after
- 8 tình huống điển hình chi tiết
- Templates có thể tái sử dụng

**Advanced Topics (Slides 27-37):**
- Hiểu legacy code
- Tích hợp API
- Thiết lập CI/CD
- Xử lý khi AI sai
- Tối ưu chi phí
- Tài liệu tham khảo nhanh
- Bảo mật & quyền riêng tư
- Rủi ro prompt injection & bảo mật
- Tuân thủ & quy định
- Thực tiễn tốt nhất về bảo mật

### 📋 Kế Hoạch Hành Động - Bắt Đầu Ngay:

**Hôm Nay (30 phút):**
1. Lưu lại slide deck này
2. Thử 1 prompt với CTCO framework
3. So sánh kết quả với prompt cũ

**Tuần Này (2 giờ):**
1. Tạo 3 templates cho các tác vụ thường làm nhất
2. Test templates với công việc thực tế
3. Điều chỉnh dựa trên kết quả

**2-3 Tuần Đầu (Thực Hành & Tinh Chỉnh):**
1. Xây dựng thư viện prompt cá nhân (10-15 templates)
2. Đo lường thời gian tiết kiệm trên các tác vụ thường xuyên
3. Tinh chỉnh prompts dựa trên phản hồi

**Sau 1 Tháng:**
- Có thể tiết kiệm 5-10 giờ/tháng cho các tác vụ thường xuyên
- Chia sẻ templates với team
- Theo dõi ROI (thời gian tiết kiệm, chất lượng cải thiện)

### 🚀 Bước Tiếp Theo:

**Cấp 1: Người Mới Bắt Đầu**
- Dùng CTCO framework cho mọi prompt
- Tập trung vào sự rõ ràng và cụ thể
- Xây dựng 5 templates cơ bản

**Cấp 2: Trung Cấp**
- Thử advanced techniques (Chain of Thought, Few-Shot)
- Tối ưu về chi phí và tốc độ
- Chia sẻ prompts với team

**Cấp 3: Nâng Cao**
- Xây dựng thư viện prompt của team
- Tự động hóa các prompts thường dùng
- Đào tạo các thành viên trong team
- Đo lường và tối ưu ROI

### 💡 Ghi Nhớ:

**Prompt Engineering là kỹ năng:**
- Cần luyện tập đều đặn
- Cải thiện qua vòng phản hồi
- Phát triển theo các AI models mới

**Không phải công thức ma thuật:**
- Mỗi project khác nhau
- Mỗi AI model khác nhau
- Cần thích nghi và thực nghiệm

**ROI rất cao:**
- 30 phút học → tiết kiệm hàng giờ mỗi tuần
- Chất lượng code tốt hơn
- Phát triển nhanh hơn
- Ít cần debug hơn

### 📚 Tài Nguyên Bổ Sung:

**Tài Liệu Chính Thức:**
- [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

**Cộng Đồng:**
- r/PromptEngineering
- Các server Discord về AI Engineering
- Cộng đồng Developer trên Twitter/X

**Công Cụ:**
- Claude Code CLI
- Cursor AI
- GitHub Copilot
- ChatGPT

---

## Phụ Lục: Glossary - Thuật Ngữ Quan Trọng

**Chain of Thought (CoT):** Kỹ thuật yêu cầu AI suy luận từng bước trước khi đưa ra kết quả cuối cùng.

**Few-Shot Prompting:** Cung cấp một vài ví dụ để AI học pattern và áp dụng cho task mới.

**Hallucination:** Khi AI tạo ra thông tin không chính xác hoặc không tồn tại (APIs, functions, facts).

**Context Window:** Giới hạn số tokens AI có thể xử lý trong một lần (vd: 200K tokens).

**Token:** Đơn vị nhỏ nhất AI xử lý, thường là 1 từ hoặc một phần của từ.

**Temperature:** Tham số điều chỉnh độ "creative" của AI (0 = deterministic, 1 = random).

**CTCO Framework:** Context-Task-Constraints-Output - framework để structure prompts hiệu quả.

**Iterative Refinement:** Cải thiện dần prompt qua nhiều vòng feedback.

**Role Prompting:** Định nghĩa vai trò/expertise cho AI (vd: "Bạn là senior engineer...").

**Zero-Shot:** Yêu cầu AI làm task mà không cung cấp ví dụ.

---

*Slide deck này được tạo dựa trên research từ nhiều nguồn uy tín và best practices thực tế từ developer community năm 2026.*

**Phiên bản:** 2.0 (Cập nhật: 2026-03-11)

**Tác giả:** AI Research Team

**License:** Free to use for educational purposes

---

**🎉 Chúc bạn thành công với Prompt Engineering!**

*"The best prompt is the one that gets you the right answer on the first try."*

---
---

## Slide 17 – Những Điều Quan Trọng Nhất Cần Ghi Nhớ

### 1. Đối Xử Với Prompts Như Code
• Version control các prompts hiệu quả
• Test và tinh chỉnh prompts
• Chia sẻ prompts trong team

### 2. Tính Cụ Thể > Tính Ngắn Gọn
• Prompt dài nhưng cụ thể > prompt ngắn nhưng mơ hồ
• Tiết kiệm thời gian về lâu dài

### 3. Ngữ Cảnh Là Vua
• Càng nhiều ngữ cảnh liên quan, kết quả càng tốt
• Tham chiếu các mẫu code hiện có

### 4. Lặp Lại, Đừng Mong Đợi Hoàn Hảo
• Bắt đầu rộng, tinh chỉnh dần dần
• Sử dụng vòng phản hồi

### 5. Sử Dụng Frameworks
• CTCO (Context-Task-Constraints-Output)
• Tính nhất quán → Kết quả tốt hơn

### 6. Ngăn Chặn Hallucinations
• Neo trong code hiện có
• Chỉ định phiên bản chính xác
• Thêm các bước xác minh

### 7. Chia Nhỏ Các Tác Vụ Phức Tạp
• 10 prompts tập trung > 1 prompt khổng lồ
• Dễ debug và lặp lại hơn

### 8. Học Từ Thất Bại
• Khi AI output sai, phân tích tại sao
• Cải thiện prompt cho lần sau

### 9. Xây Dựng Thư Viện Templates
• Templates có thể tái sử dụng cho các tác vụ thường gặp
• Tiết kiệm thời gian và đảm bảo tính nhất quán

### 10. Prompt Engineering Là Kỹ Năng Cần Luyện Tập
• Thực hành có chủ đích
• Học từ các ví dụ tốt
• Cải thiện liên tục

---

## Slide 18 – Hành Động Cụ Thể: Bắt Đầu Ngay Hôm Nay

### Tuần 1: Nền Tảng
• Áp dụng CTCO framework cho mọi prompt
• Ghi chép 5 prompts tốt nhất bạn dùng
• Xác định 3 prompts yếu và cải thiện chúng

### Tuần 2: Xây Dựng Templates
• Tạo templates cho 5 tác vụ thường làm nhất
• Chia sẻ templates với team
• Thu thập phản hồi và lặp lại

### Tuần 3: Kỹ Thuật Nâng Cao
• Thử chain of thought prompting
• Thử nghiệm với role prompting
• Thực hành iterative refinement

### Tuần 4: Đo Lường Tác Động
• Theo dõi thời gian tiết kiệm được
• So sánh chất lượng code trước/sau
• Tinh chỉnh templates dựa trên kết quả

### Liên Tục:
• Xây dựng thư viện prompt của team
• Review và cập nhật templates hàng tháng
• Chia sẻ kinh nghiệm trong các cuộc họp team

---

## Nguồn Tham Khảo

### Tài Liệu Chính Thức:
- [Anthropic Claude Documentation](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [OpenAI Platform Documentation](https://platform.openai.com/docs/guides/prompt-engineering)
- [GitHub Copilot Resources](https://github.com/features/copilot)

### Nghiên Cứu & Best Practices:
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- Các bài nghiên cứu về Chain of Thought Prompting
- Nghiên cứu về Few-Shot Learning
- Tài liệu ReAct Framework

### Cộng Đồng Developers:
- Các blog về AI Engineering
- Nghiên cứu về năng suất Developer
- Case studies thực tế từ 2025-2026

### Công Cụ & Frameworks:
- Claude Code CLI
- Tài liệu Cursor AI
- Microsoft Copilot Patterns

---

## Kết Luận

Prompt engineering không phải là "mẹo" hay "thủ thuật" - đây là kỹ năng giao tiếp chuyên nghiệp với các công cụ AI.

**Ghi nhớ:**
• AI assistants khuếch đại ý định của bạn - nhưng chỉ khi ý định được truyền đạt rõ ràng
• Prompts tốt = Code tốt = Năng suất cao
• Đầu tư thời gian học prompt engineering → ROI rất cao

**Bắt đầu từ nhỏ, lặp lại thường xuyên, đo lường kết quả.**

Chúc các bạn thành công! 🚀

---

*Slide deck này được tạo dựa trên research từ nhiều nguồn uy tín và best practices thực tế từ developer community năm 2026.*

---

## Tổng Kết & Hành Động Tiếp Theo

### 🎓 Những Gì Bạn Đã Học:

**Foundations (Slides 1-5):**
- Tại sao prompt engineering quan trọng
- Vấn đề developers thường gặp
- Nguyên tắc cốt lõi
- CTCO Framework

**Practical Examples (Slides 6-26):**
- 21 ví dụ thực tế với before/after
- 8 tình huống điển hình chi tiết
- Templates có thể tái sử dụng

**Advanced Topics (Slides 27-37):**
- Hiểu legacy code
- Tích hợp API
- Thiết lập CI/CD
- Xử lý khi AI sai
- Tối ưu chi phí
- Tài liệu tham khảo nhanh
- Bảo mật & quyền riêng tư
- Rủi ro prompt injection & bảo mật
- Tuân thủ & quy định
- Thực tiễn tốt nhất về bảo mật

### 📋 Kế Hoạch Hành Động - Bắt Đầu Ngay:

**Hôm Nay (30 phút):**
1. Lưu lại slide deck này
2. Thử 1 prompt với CTCO framework
3. So sánh kết quả với prompt cũ

**Tuần Này (2 giờ):**
1. Tạo 3 templates cho các tác vụ thường làm nhất
2. Test templates với công việc thực tế
3. Điều chỉnh dựa trên kết quả

**2-3 Tuần Đầu (Thực Hành & Tinh Chỉnh):**
1. Xây dựng thư viện prompt cá nhân (10-15 templates)
2. Đo lường thời gian tiết kiệm trên các tác vụ thường xuyên
3. Tinh chỉnh prompts dựa trên phản hồi

**Sau 1 Tháng:**
- Có thể tiết kiệm 5-10 giờ/tháng cho các tác vụ thường xuyên
- Chia sẻ templates với team
- Theo dõi ROI (thời gian tiết kiệm, chất lượng cải thiện)

### 🚀 Bước Tiếp Theo:

**Cấp 1: Người Mới Bắt Đầu**
- Dùng CTCO framework cho mọi prompt
- Tập trung vào sự rõ ràng và cụ thể
- Xây dựng 5 templates cơ bản

**Cấp 2: Trung Cấp**
- Thử advanced techniques (Chain of Thought, Few-Shot)
- Tối ưu về chi phí và tốc độ
- Chia sẻ prompts với team

**Cấp 3: Nâng Cao**
- Xây dựng thư viện prompt của team
- Tự động hóa các prompts thường dùng
- Đào tạo các thành viên trong team
- Đo lường và tối ưu ROI

### 💡 Ghi Nhớ:

**Prompt Engineering là kỹ năng:**
- Cần luyện tập đều đặn
- Cải thiện qua vòng phản hồi
- Phát triển theo các AI models mới

**Không phải công thức ma thuật:**
- Mỗi project khác nhau
- Mỗi AI model khác nhau
- Cần thích nghi và thực nghiệm

**ROI rất cao:**
- 30 phút học → tiết kiệm hàng giờ mỗi tuần
- Chất lượng code tốt hơn
- Phát triển nhanh hơn
- Ít cần debug hơn

### 📚 Tài Nguyên Bổ Sung:

**Tài Liệu Chính Thức:**
- [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

**Cộng Đồng:**
- r/PromptEngineering
- Các server Discord về AI Engineering
- Cộng đồng Developer trên Twitter/X

**Công Cụ:**
- Claude Code CLI
- Cursor AI
- GitHub Copilot
- ChatGPT

---

## Phụ Lục: Glossary - Thuật Ngữ Quan Trọng

**Chain of Thought (CoT):** Kỹ thuật yêu cầu AI suy luận từng bước trước khi đưa ra kết quả cuối cùng.

**Few-Shot Prompting:** Cung cấp một vài ví dụ để AI học pattern và áp dụng cho task mới.

**Hallucination:** Khi AI tạo ra thông tin không chính xác hoặc không tồn tại (APIs, functions, facts).

**Context Window:** Giới hạn số tokens AI có thể xử lý trong một lần (vd: 200K tokens).

**Token:** Đơn vị nhỏ nhất AI xử lý, thường là 1 từ hoặc một phần của từ.

**Temperature:** Tham số điều chỉnh độ "creative" của AI (0 = deterministic, 1 = random).

**CTCO Framework:** Context-Task-Constraints-Output - framework để structure prompts hiệu quả.

**Iterative Refinement:** Cải thiện dần prompt qua nhiều vòng feedback.

**Role Prompting:** Định nghĩa vai trò/expertise cho AI (vd: "Bạn là senior engineer...").

**Zero-Shot:** Yêu cầu AI làm task mà không cung cấp ví dụ.

---

*Slide deck này được tạo dựa trên research từ nhiều nguồn uy tín và best practices thực tế từ developer community năm 2026.*

**Phiên bản:** 2.0 (Cập nhật: 2026-03-11)

**Tác giả:** AI Research Team

**License:** Free to use for educational purposes

---

**🎉 Chúc bạn thành công với Prompt Engineering!**

*"The best prompt is the one that gets you the right answer on the first try."*

---
