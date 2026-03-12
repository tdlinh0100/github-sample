# 📝 BÀI TẬP THỰC HÀNH - PROMPT ENGINEERING FOR DEVELOPERS

**Mục đích:** Áp dụng kiến thức từ slide deck vào các tình huống thực tế
**Thời gian:** 2-3 giờ
**Cấp độ:** Beginner → Intermediate → Advanced

---

## 🎯 HƯỚNG DẪN SỬ DỤNG

### Cách Làm Bài:
1. Đọc kỹ từng bài tập
2. Viết prompt theo CTCO Framework
3. Test prompt với AI tool (Claude Code, Copilot, ChatGPT)
4. So sánh kết quả với đáp án gợi ý
5. Tự đánh giá và cải thiện

### Tiêu Chí Đánh Giá Prompt:
- [ ] Có đủ Context?
- [ ] Task rõ ràng?
- [ ] Constraints được chỉ định?
- [ ] Output format được define?
- [ ] Junior dev có hiểu không?

---

## 📚 PHẦN 1: BEGINNER (5 bài)

### Bài 1: Viết Function Đơn Giản

**Tình huống:**
Bạn cần viết một function JavaScript để format số tiền theo định dạng Việt Nam (VD: 1000000 → "1.000.000 ₫")

**Yêu cầu:**
Viết prompt để AI generate function này

**Gợi ý:**
- Framework/language gì?
- Input/output format?
- Edge cases nào cần xử lý?
- Có cần tests không?

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 2: Debug Lỗi Đơn Giản

**Tình huống:**
Code này bị lỗi nhưng bạn không biết tại sao:

```javascript
function calculateTotal(items) {
  let total = 0;
  items.forEach(item => {
    total += item.price * item.quantity;
  });
  return total;
}

// Test
const cart = [
  { name: "Laptop", price: "15000000", quantity: 1 },
  { name: "Mouse", price: "200000", quantity: 2 }
];

console.log(calculateTotal(cart)); // Output: "150000002000002000000" ???
```

**Yêu cầu:**
Viết prompt để AI giải thích lỗi và fix

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 3: Refactor Code

**Tình huống:**
Code này hoạt động nhưng khó đọc:

```javascript
function p(u) {
  if (u.a > 18 && u.s === 'a' && u.e && u.e.includes('@')) {
    return true;
  } else {
    return false;
  }
}
```

**Yêu cầu:**
Viết prompt để AI refactor code này

**Gợi ý:**
- Mục tiêu refactor là gì?
- Có constraints gì không?
- Cần giữ nguyên logic?

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 4: Viết Tests

**Tình huống:**
Bạn có function này và cần viết tests:

```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

**Yêu cầu:**
Viết prompt để AI generate test cases

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 5: Giải Thích Code

**Tình huống:**
Bạn thấy đoạn code này trong codebase nhưng không hiểu:

```javascript
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
```

**Yêu cầu:**
Viết prompt để AI giải thích code này

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

## 🚀 PHẦN 2: INTERMEDIATE (5 bài)

### Bài 6: Tạo API Endpoint

**Tình huống:**
Bạn cần tạo API endpoint GET /api/users để lấy danh sách users với pagination và filtering

**Tech Stack:**
- Express.js + TypeScript
- PostgreSQL + Prisma
- Cấu trúc: /src/routes/, /src/services/

**Yêu cầu:**
Viết prompt để AI generate:
- Route handler
- Service logic
- Validation schema
- Error handling

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 7: Tối Ưu Database Query

**Tình huống:**
Query này chạy chậm (3.5 giây):

```sql
SELECT * FROM orders
WHERE user_id = 123
AND status = 'completed'
AND created_at > '2026-01-01'
ORDER BY created_at DESC;
```

**Context:**
- Table orders có 5M rows
- Không có index nào
- PostgreSQL 15

**Yêu cầu:**
Viết prompt để AI tối ưu query này

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 8: Code Review

**Tình huống:**
Junior dev submit PR với code này:

```javascript
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query(
    `SELECT * FROM users WHERE email = '${email}'`
  );

  if (user && user.password === password) {
    res.json({ token: user.id });
  } else {
    res.json({ error: 'Invalid credentials' });
  }
});
```

**Yêu cầu:**
Viết prompt để AI review code và chỉ ra security issues

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 9: Refactor Legacy Code

**Tình huống:**
Function này có 200 dòng, nested 5 cấp, và không có tests:

```javascript
function processOrder(order, user, payment, shipping, discount, inventory) {
  // 200 lines of nested if/else
  // Multiple responsibilities
  // No error handling
  // Magic numbers everywhere
  // No tests
}
```

**Yêu cầu:**
Viết prompt để AI refactor function này

**Gợi ý:**
- Mục tiêu cụ thể?
- Chia nhỏ như thế nào?
- Patterns nào cần follow?

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 10: Debug Production Error

**Tình huống:**
Production app bị crash với error:

```
TypeError: Cannot read property 'map' of undefined
  at ProductList.render (ProductList.jsx:45)
  at React.Component.render
```

**Context:**
- React 18.2.0
- Error xảy ra với 30% users
- Chỉ xảy ra với category "electronics"
- Logs: API trả về { success: true, data: null }
- Recent change: v2.3.0 thay đổi API response format

**Yêu cầu:**
Viết prompt để AI debug và fix

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

## 🎓 PHẦN 3: ADVANCED (5 bài)

### Bài 11: Thiết Kế System Architecture

**Tình huống:**
Bạn cần thiết kế hệ thống real-time notification cho app có:
- 50K concurrent users
- 1000 notifications/giây
- Delivery latency < 2 giây
- Support web + mobile
- Budget: $3000/tháng

**Tech Stack:**
- Backend: Node.js
- Database: PostgreSQL
- Cloud: AWS
- Team: 2 backend devs

**Yêu cầu:**
Viết prompt để AI thiết kế architecture

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 12: Migrate Legacy System

**Tình huống:**
Cần migrate từ MongoDB sang PostgreSQL:
- 10M documents
- 50 collections
- Downtime tối đa: 2 giờ
- Zero data loss
- Rollback plan required

**Yêu cầu:**
Viết prompt để AI tạo migration plan

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 13: Performance Optimization

**Tình huống:**
React app load chậm:
- Initial load: 8 giây
- Bundle size: 5MB
- Lighthouse score: 35/100
- 50+ components
- No code splitting

**Yêu cầu:**
Viết prompt để AI tạo optimization plan

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 14: Security Audit

**Tình huống:**
Cần audit authentication system trước khi launch:
- JWT-based auth
- Password hashing với bcrypt
- Session management
- Rate limiting
- CORS configuration

**Yêu cầu:**
Viết prompt để AI audit security

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Bài 15: CI/CD Pipeline

**Tình huống:**
Cần setup CI/CD cho Node.js API:
- GitHub Actions
- Run tests, linting, type check
- Deploy to staging on PR
- Deploy to production on merge to main
- Rollback capability

**Yêu cầu:**
Viết prompt để AI tạo CI/CD config

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

## 🎯 PHẦN 4: CHALLENGE (3 bài khó)

### Challenge 1: Multi-Step Complex Task

**Tình huống:**
Implement full authentication system từ đầu:
- User registration với email verification
- Login với JWT
- Password reset flow
- 2FA với TOTP
- Session management
- Rate limiting
- Security best practices

**Yêu cầu:**
Viết SERIES of prompts (không phải 1 prompt) để AI implement từng bước

**Prompts của bạn:**
```
Prompt 1 (Planning):
[Viết ở đây]

Prompt 2 (Database Schema):
[Viết ở đây]

Prompt 3 (Registration):
[Viết ở đây]

Prompt 4 (Login):
[Viết ở đây]

Prompt 5 (Password Reset):
[Viết ở đây]

Prompt 6 (2FA):
[Viết ở đây]

Prompt 7 (Security Review):
[Viết ở đây]

Prompt 8 (Tests):
[Viết ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Challenge 2: Debug Complex Race Condition

**Tình huống:**
Hệ thống payment processing đôi khi charge khách hàng 2 lần:
- Xảy ra random (~1% transactions)
- Không reproduce được locally
- Chỉ xảy ra khi traffic cao
- Logs không rõ ràng
- Multiple microservices involved

**Yêu cầu:**
Viết prompt để AI giúp debug race condition này

**Prompt của bạn:**
```
[Viết prompt ở đây]
```

**Tự đánh giá (1-10):** ___/10

---

### Challenge 3: Legacy Code Understanding

**Tình huống:**
Bạn nhận maintain codebase 5 năm tuổi:
- 50K lines of code
- No documentation
- No tests
- Cryptic variable names
- Complex business logic
- Original developers đã nghỉ việc

**Yêu cầu:**
Viết strategy (multiple prompts) để AI giúp hiểu codebase này

**Strategy của bạn:**
```
Step 1:
[Prompt để understand overall structure]

Step 2:
[Prompt để identify critical paths]

Step 3:
[Prompt để understand business logic]

Step 4:
[Prompt để create documentation]

Step 5:
[Prompt để identify refactoring opportunities]
```

**Tự đánh giá (1-10):** ___/10

---

## 📊 ĐÁP ÁN GỢI Ý

### Bài 1: Viết Function Đơn Giản

**Prompt Mẫu (9/10):**
```
Viết JavaScript function formatCurrency() để format số tiền theo định dạng Việt Nam:

YÊU CẦU:
- Input: number (VD: 1000000)
- Output: string với dấu chấm ngăn cách và ký hiệu ₫ (VD: "1.000.000 ₫")
- Xử lý số âm: hiển thị dấu trừ trước (VD: "-1.000.000 ₫")
- Xử lý số thập phân: làm tròn đến 2 chữ số (VD: 1000000.567 → "1.000.000,57 ₫")
- Xử lý edge cases: null, undefined, NaN → return "0 ₫"

RÀNG BUỘC:
- Pure JavaScript (không dùng thư viện)
- Không dùng Intl.NumberFormat (để học cách implement)
- Performance: < 1ms cho số < 1 tỷ

ĐẦU RA:
- Function implementation với JSDoc
- 8 test cases:
  - formatCurrency(1000000) → "1.000.000 ₫"
  - formatCurrency(0) → "0 ₫"
  - formatCurrency(-500000) → "-500.000 ₫"
  - formatCurrency(1234567.89) → "1.234.567,89 ₫"
  - formatCurrency(null) → "0 ₫"
  - formatCurrency(undefined) → "0 ₫"
  - formatCurrency(NaN) → "0 ₫"
  - formatCurrency(999) → "999 ₫"
```

**Tại sao tốt:**
✅ Context: JavaScript, định dạng Việt Nam
✅ Task: Rõ ràng với input/output examples
✅ Constraints: Pure JS, performance requirement
✅ Output: Function + tests cụ thể
✅ Edge cases: Đầy đủ

---

### Bài 2: Debug Lỗi Đơn Giản

**Prompt Mẫu (9/10):**
```
Debug lỗi JavaScript trong function calculateTotal():

CODE HIỆN TẠI:
function calculateTotal(items) {
  let total = 0;
  items.forEach(item => {
    total += item.price * item.quantity;
  });
  return total;
}

TRIỆU CHỨNG:
- Input: [{ name: "Laptop", price: "15000000", quantity: 1 }, { name: "Mouse", price: "200000", quantity: 2 }]
- Expected output: 15400000
- Actual output: "150000002000002000000" (string concatenation thay vì addition)

NGỮ CẢNH:
- JavaScript (Node.js 20.x)
- Data từ API (prices là strings, không phải numbers)
- Function được dùng trong shopping cart

CẦN:
1. Giải thích TẠI SAO lỗi xảy ra (type coercion)
2. Fix code với proper type conversion
3. Add input validation để tránh lỗi tương tự
4. Suggest 3 test cases để catch lỗi này sớm hơn
5. Best practice cho handling numeric data từ API
```

**Tại sao tốt:**
✅ Code đầy đủ
✅ Triệu chứng cụ thể với expected vs actual
✅ Context về data source
✅ Yêu cầu giải thích + fix + prevention
✅ Học được best practices

---

### Bài 6: Tạo API Endpoint

**Prompt Mẫu (10/10):**
```
Tạo API endpoint GET /api/users để lấy danh sách users với pagination và filtering:

NGỮ CẢNH:
- Framework: Express.js với TypeScript
- Database: PostgreSQL qua Prisma ORM
- Cấu trúc hiện tại: /src/routes/, /src/services/, /src/middleware/
- Authentication: JWT middleware đã có sẵn

YÊU CẦU CHỨC NĂNG:
- Pagination: query params ?page=1&limit=20 (default limit=20, max=100)
- Filtering: ?role=admin&status=active&search=john (search trong name và email)
- Sorting: ?sortBy=createdAt&order=desc (default: createdAt desc)
- Response format:
  {
    "success": true,
    "data": [{ id, name, email, role, status, createdAt }],
    "meta": { total, page, limit, totalPages }
  }

XỬ LÝ LỖI:
- 400: Invalid query parameters (page < 1, limit > 100)
- 401: Unauthorized (no JWT token)
- 403: Forbidden (không phải admin)
- 500: Database error

RÀNG BUỘC:
- Validate query params bằng Zod
- Chỉ admin mới được xem danh sách users
- Response time < 200ms với 10K users
- Prisma query phải efficient (select only needed fields)

ĐẦU RA:
1. Route handler: /src/routes/users.ts
2. Service logic: /src/services/user.service.ts
3. Zod validation schema: /src/schemas/user.schema.ts
4. Types: /src/types/user.types.ts
5. Example cURL request với tất cả query params
```

**Tại sao tốt:**
✅ Context đầy đủ về tech stack và structure
✅ Requirements chi tiết với examples
✅ Error handling cụ thể
✅ Constraints về performance và security
✅ Output rõ ràng với file structure

---

### Bài 11: Thiết Kế System Architecture

**Prompt Mẫu (10/10):**
```
Thiết kế kiến trúc real-time notification system:

YÊU CẦU NGHIỆP VỤ:
- Push notifications đến web (browser) và mobile (iOS/Android)
- Notification types: order updates, messages, system alerts
- User preferences: enable/disable per type
- Notification history: lưu 30 ngày
- Read/unread status tracking

YÊU CẦU QUY MÔ:
- 50,000 concurrent users
- 1000 notifications/giây peak
- Delivery latency: < 2 giây (p95)
- Uptime: 99.9%
- Storage: ~100GB/năm

RÀNG BUỘC:
- Backend: Node.js (team có kinh nghiệm)
- Database: PostgreSQL (đã có sẵn)
- Cloud: AWS (đã có account)
- Budget: $3000/tháng
- Team: 2 backend devs, 1 frontend dev

HẠ TẦNG HIỆN CÓ:
- User authentication service (JWT)
- API Gateway (Kong)
- Redis cluster (caching)
- S3 (file storage)

THÁCH THỨC KỸ THUẬT:
1. Làm sao maintain 50K WebSocket connections?
2. Làm sao deliver notifications khi user offline?
3. Làm sao scale horizontally?
4. Làm sao handle connection drops và reconnects?

CẦN THIẾT KẾ:
1. Sơ đồ kiến trúc high-level (ASCII format)
2. WebSocket vs Server-Sent Events vs Long Polling - lựa chọn và tại sao?
3. Message queue strategy (Redis Pub/Sub, RabbitMQ, AWS SQS?)
4. Database schema cho notifications và preferences
5. Caching strategy
6. Horizontal scaling approach
7. Cost breakdown ($3000/tháng)
8. Monitoring và alerting strategy

DELIVERABLES:
- Architecture diagram (text/ASCII)
- Component descriptions
- Technology choices với trade-offs
- Database schema
- API design
- Scalability plan
- Cost analysis
- Risk mitigation strategies
```

**Tại sao tốt:**
✅ Requirements đầy đủ với metrics cụ thể
✅ Constraints về tech, budget, team
✅ Leverage hạ tầng hiện có
✅ Thách thức kỹ thuật cụ thể
✅ Deliverables rõ ràng
✅ Yêu cầu trade-offs analysis

---

## 📈 CÁCH TỰ ĐÁNH GIÁ

### Rubric Đánh Giá Prompt (1-10):

**10/10 - Excellent:**
- ✅ Context đầy đủ (tech stack, versions, structure)
- ✅ Task rõ ràng với examples
- ✅ Constraints cụ thể (performance, security, budget)
- ✅ Output format được define
- ✅ Edge cases được mention
- ✅ Junior dev có thể hiểu và execute

**8-9/10 - Good:**
- ✅ Có context nhưng thiếu một vài details
- ✅ Task rõ ràng
- ✅ Có constraints
- ✅ Output format OK
- ⚠️ Thiếu một vài edge cases

**6-7/10 - Acceptable:**
- ⚠️ Context chung chung
- ✅ Task rõ ràng
- ⚠️ Constraints không đầy đủ
- ⚠️ Output format vague
- ❌ Không mention edge cases

**< 6/10 - Needs Improvement:**
- ❌ Thiếu context
- ⚠️ Task mơ hồ
- ❌ Không có constraints
- ❌ Không define output
- ❌ Không có edge cases

---

## 🎯 NEXT STEPS

### Sau Khi Hoàn Thành Bài Tập:

**1. Review & Reflect (30 phút):**
- So sánh prompts của bạn với đáp án mẫu
- Identify patterns trong prompts tốt
- Note down những gì cần cải thiện

**2. Build Prompt Library (1 giờ):**
- Tạo file templates cho các task thường gặp
- Organize theo categories
- Version control với Git

**3. Practice Daily (15 phút/ngày):**
- Mỗi ngày viết 1 prompt cho công việc thực tế
- Track time saved và quality improvement
- Iterate dựa trên kết quả

**4. Share & Learn (ongoing):**
- Share prompts tốt với team
- Review prompts của teammates
- Build team prompt library

---

## 📚 TÀI LIỆU THAM KHẢO

### Để Cải Thiện Prompts:
- Slide deck: `prompt-engineering-for-developers.md`
- CTCO Framework: Slide 5
- Templates: Slides 13, 15, 32
- Examples: Slides 6-10, 19-29

### Tools Để Practice:
- Claude Code: https://claude.ai/code
- ChatGPT: https://chat.openai.com
- GitHub Copilot: https://github.com/features/copilot
- Cursor: https://cursor.sh

---

**Bài tập được tạo:** 2026-03-12
**Phiên bản:** 1.0
**Tác giả:** Based on "Prompt Engineering for Developers" slide deck
**License:** Free to use for learning purposes

---

## 💡 TIPS CUỐI CÙNG

1. **Không có prompt hoàn hảo ngay lần đầu** - Iterate và improve
2. **Test với real AI tools** - Đừng chỉ viết trên giấy
3. **Measure results** - Track time saved và quality
4. **Learn from failures** - Khi AI output sai, phân tích tại sao
5. **Build habits** - Practice 15 phút mỗi ngày tốt hơn 2 giờ mỗi tuần

**Chúc bạn học tốt! 🚀**
