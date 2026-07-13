export interface ResultData {
  id: number;
  course: string;
  name: string;
  exam: string;
  score: string;
  percent: number;
  status: "Pass" | "Fail";
  time: string;
  email: string;
  studentId: string;
  examType: string;
  duration: string;
  timeTaken: string;
  submission: string;
  totalScore: number;
  maxScore: number;
  mcqScore: number;
  mcqMaxScore: number;
  codingScore: number;
  codingMaxScore: number;
  mcqCorrect: number;
  mcqTotal: number;
  codingProblems: number;
  codingTestCases: {
    passed: number;
    total: number;
  };
  problems: {
    title: string;
    language: string;
    marks: string;
    code: string;
    testPassed: number;
    testTotal: number;
    status: "All Passed" | "Partially Correct";
  }[];
}

export const resultsData: ResultData[] = [
  {
    id: 0,
    course: "Computer Science",
    name: "Alice Johnson",
    exam: "Data Structures & Algorithms",
    score: "85/100",
    percent: 85,
    status: "Pass",
    time: "15/03/2026, 14:30:00",
    email: "alice.j@university.edu",
    studentId: "STU-00001",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "105 min",
    submission: "2026-03-15 14:30",
    totalScore: 85,
    maxScore: 100,
    mcqScore: 8,
    mcqMaxScore: 10,
    codingScore: 27,
    codingMaxScore: 30,
    mcqCorrect: 4,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 18, total: 20 },
    problems: [
      {
        title: "Problem 1: Implement a function to reverse a linked list",
        language: "Python",
        marks: "12/15 marks",
        code: `def reverseList(head):
    prev = None
    current = head
 
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
 
    return prev`,
        testPassed: 8,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: Find the kth largest element in an array",
        language: "Python",
        marks: "15/15 marks",
        code: `def findKthLargest(nums, k):
    nums.sort(reverse=True)
    return nums[k-1]`,
        testPassed: 10,
        testTotal: 10,
        status: "All Passed"
      }
    ]
  },
  {
    id: 1,
    course: "Computer Science",
    name: "Alice Johnson",
    exam: "Database Management Systems",
    score: "92/100",
    percent: 92,
    status: "Pass",
    time: "14/03/2026, 16:20:00",
    email: "alice.j@university.edu",
    studentId: "STU-00001",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "110 min",
    submission: "2026-03-14 16:20",
    totalScore: 92,
    maxScore: 100,
    mcqScore: 9,
    mcqMaxScore: 10,
    codingScore: 28,
    codingMaxScore: 30,
    mcqCorrect: 5,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 19, total: 20 },
    problems: [
      {
        title: "Problem 1: Implement SQL query for joining tables",
        language: "SQL",
        marks: "14/15 marks",
        code: `SELECT u.name, e.exam_name, s.score
FROM users u
JOIN enrollments e ON u.id = e.user_id
JOIN scores s ON e.id = s.enrollment_id
WHERE u.department = 'CS'`,
        testPassed: 9,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: Create database schema for e-commerce",
        language: "SQL",
        marks: "14/15 marks",
        code: `CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);`,
        testPassed: 10,
        testTotal: 10,
        status: "All Passed"
      }
    ]
  },
  {
    id: 2,
    course: "Information Technology",
    name: "Bob Smith",
    exam: "Web Development",
    score: "78/100",
    percent: 78,
    status: "Pass",
    time: "13/03/2026, 11:45:00",
    email: "bob.s@university.edu",
    studentId: "STU-00002",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "115 min",
    submission: "2026-03-13 11:45",
    totalScore: 78,
    maxScore: 100,
    mcqScore: 7,
    mcqMaxScore: 10,
    codingScore: 25,
    codingMaxScore: 30,
    mcqCorrect: 3,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 16, total: 20 },
    problems: [
      {
        title: "Problem 1: Create responsive navigation bar",
        language: "HTML/CSS",
        marks: "12/15 marks",
        code: `<nav class="navbar">
    <div class="nav-brand">Logo</div>
    <ul class="nav-menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
    </ul>
</nav>`,
        testPassed: 8,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: Implement form validation",
        language: "JavaScript",
        marks: "13/15 marks",
        code: `function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email.includes('@')) {
        alert('Invalid email');
        return false;
    }
    return true;
}`,
        testPassed: 8,
        testTotal: 10,
        status: "Partially Correct"
      }
    ]
  },
  {
    id: 3,
    course: "Data Science",
    name: "Carol Davis",
    exam: "Machine Learning Fundamentals",
    score: "95/100",
    percent: 95,
    status: "Pass",
    time: "12/03/2026, 15:10:00",
    email: "carol.d@university.edu",
    studentId: "STU-00003",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "95 min",
    submission: "2026-03-12 15:10",
    totalScore: 95,
    maxScore: 100,
    mcqScore: 10,
    mcqMaxScore: 10,
    codingScore: 28,
    codingMaxScore: 30,
    mcqCorrect: 5,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 20, total: 20 },
    problems: [
      {
        title: "Problem 1: Implement linear regression",
        language: "Python",
        marks: "14/15 marks",
        code: `import numpy as np

def linear_regression(X, y):
    X_b = np.c_[np.ones((X.shape[0], 1)), X]
    theta = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)
    return theta`,
        testPassed: 9,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: Data preprocessing pipeline",
        language: "Python",
        marks: "14/15 marks",
        code: `from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

def preprocess_data(X):
    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(X)
    scaler = StandardScaler()
    return scaler.fit_transform(X_imputed)`,
        testPassed: 10,
        testTotal: 10,
        status: "All Passed"
      }
    ]
  },
  {
    id: 4,
    course: "Artificial Intelligence",
    name: "David Wilson",
    exam: "Neural Networks",
    score: "88/100",
    percent: 88,
    status: "Pass",
    time: "11/03/2026, 17:00:00",
    email: "david.w@university.edu",
    studentId: "STU-00004",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "108 min",
    submission: "2026-03-11 17:00",
    totalScore: 88,
    maxScore: 100,
    mcqScore: 8,
    mcqMaxScore: 10,
    codingScore: 28,
    codingMaxScore: 30,
    mcqCorrect: 4,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 18, total: 20 },
    problems: [
      {
        title: "Problem 1: Implement backpropagation",
        language: "Python",
        marks: "13/15 marks",
        code: `def backpropagation(X, y, weights):
    gradients = {}
    # Forward pass
    output = forward_pass(X, weights)
    # Backward pass
    error = output - y
    gradients['output'] = error
    return gradients`,
        testPassed: 8,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: Convolutional neural network layer",
        language: "Python",
        marks: "15/15 marks",
        code: `import torch.nn as nn

class ConvLayer(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv = nn.Conv2d(in_channels, out_channels, 3)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        return self.relu(self.conv(x))`,
        testPassed: 10,
        testTotal: 10,
        status: "All Passed"
      }
    ]
  },
  {
    id: 5,
    course: "Computer Science",
    name: "Emma Brown",
    exam: "Data Structures & Algorithms",
    score: "35/100",
    percent: 35,
    status: "Fail",
    time: "10/03/2026, 14:30:00",
    email: "emma.b@university.edu",
    studentId: "STU-00005",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "120 min",
    submission: "2026-03-10 14:30",
    totalScore: 35,
    maxScore: 100,
    mcqScore: 3,
    mcqMaxScore: 10,
    codingScore: 15,
    codingMaxScore: 30,
    mcqCorrect: 1,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 8, total: 20 },
    problems: [
      {
        title: "Problem 1: Implement binary search tree",
        language: "Python",
        marks: "8/15 marks",
        code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    # Incomplete implementation`,
        testPassed: 3,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: Graph traversal algorithm",
        language: "Python",
        marks: "7/15 marks",
        code: `def dfs(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            # Incomplete neighbors handling`,
        testPassed: 5,
        testTotal: 10,
        status: "Partially Correct"
      }
    ]
  },
  {
    id: 6,
    course: "Electronics Engineering",
    name: "Frank Miller",
    exam: "Digital Electronics",
    score: "72/100",
    percent: 72,
    status: "Pass",
    time: "09/03/2026, 10:20:00",
    email: "frank.m@university.edu",
    studentId: "STU-00006",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "118 min",
    submission: "2026-03-09 10:20",
    totalScore: 72,
    maxScore: 100,
    mcqScore: 7,
    mcqMaxScore: 10,
    codingScore: 25,
    codingMaxScore: 30,
    mcqCorrect: 3,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 15, total: 20 },
    problems: [
      {
        title: "Problem 1: Design truth table for logic gates",
        language: "Verilog",
        marks: "12/15 marks",
        code: `module AND_gate(input a, b, output y);
    assign y = a & b;
endmodule

module XOR_gate(input a, b, output y);
    assign y = a ^ b;
endmodule`,
        testPassed: 7,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: State machine design",
        language: "Verilog",
        marks: "13/15 marks",
        code: `module FSM(input clk, reset, input [1:0] in, output reg [1:0] out);
    reg [1:0] state;
    always @(posedge clk or posedge reset) begin
        if (reset) state <= 2'b00;
        else case(state)
            2'b00: state <= in;
            2'b01: state <= 2'b10;
        endcase
    end
endmodule`,
        testPassed: 8,
        testTotal: 10,
        status: "Partially Correct"
      }
    ]
  },
  {
    id: 7,
    course: "Computer Science",
    name: "Grace Lee",
    exam: "Operating Systems",
    score: "80/100",
    percent: 80,
    status: "Pass",
    time: "08/03/2026, 13:15:00",
    email: "grace.l@university.edu",
    studentId: "STU-00007",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "112 min",
    submission: "2026-03-08 13:15",
    totalScore: 80,
    maxScore: 100,
    mcqScore: 8,
    mcqMaxScore: 10,
    codingScore: 24,
    codingMaxScore: 30,
    mcqCorrect: 4,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 16, total: 20 },
    problems: [
      {
        title: "Problem 1: Implement process scheduler",
        language: "C",
        marks: "12/15 marks",
        code: `#include <stdio.h>
#include <stdlib.h>

struct Process {
    int pid;
    int burst_time;
    int priority;
};

void schedule_fcfs(struct Process proc[], int n) {
    // FCFS scheduling implementation
    for (int i = 0; i < n; i++) {
        printf("Process %d executed\\n", proc[i].pid);
    }
}`,
        testPassed: 8,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: Memory management simulation",
        language: "C",
        marks: "12/15 marks",
        code: `#define MEMORY_SIZE 1024
char memory[MEMORY_SIZE];

struct Block {
    int start;
    int size;
    int allocated;
};

void allocate_memory(struct Block *blocks, int size) {
    // First-fit allocation algorithm
    for (int i = 0; i < MEMORY_SIZE; i++) {
        if (!blocks[i].allocated && blocks[i].size >= size) {
            blocks[i].allocated = 1;
            break;
        }
    }
}`,
        testPassed: 8,
        testTotal: 10,
        status: "Partially Correct"
      }
    ]
  },
  {
    id: 8,
    course: "Data Science",
    name: "Ivy Chen",
    exam: "Machine Learning Fundamentals",
    score: "68/100",
    percent: 68,
    status: "Pass",
    time: "07/03/2026, 16:40:00",
    email: "ivy.c@university.edu",
    studentId: "STU-00008",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "120 min",
    submission: "2026-03-07 16:40",
    totalScore: 68,
    maxScore: 100,
    mcqScore: 6,
    mcqMaxScore: 10,
    codingScore: 22,
    codingMaxScore: 30,
    mcqCorrect: 3,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 14, total: 20 },
    problems: [
      {
        title: "Problem 1: Implement decision tree",
        language: "Python",
        marks: "11/15 marks",
        code: `import numpy as np

class DecisionTree:
    def __init__(self, max_depth=3):
        self.max_depth = max_depth
    
    def fit(self, X, y):
        # Build tree recursively
        self.tree = self._build_tree(X, y, 0)
    
    def _build_tree(self, X, y, depth):
        # Simplified tree building
        if depth >= self.max_depth:
            return np.mean(y)`,
        testPassed: 6,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: K-means clustering",
        language: "Python",
        marks: "11/15 marks",
        code: `import numpy as np

def kmeans(X, k, max_iters=100):
    # Initialize centroids randomly
    centroids = X[np.random.choice(X.shape[0], k, replace=False)]
    
    for _ in range(max_iters):
        # Assign points to nearest centroid
        distances = np.sqrt(((X - centroids[:, np.newaxis])**2).sum(axis=2))
        labels = np.argmin(distances, axis=0)`,
        testPassed: 8,
        testTotal: 10,
        status: "Partially Correct"
      }
    ]
  },
  {
    id: 9,
    course: "Computer Science",
    name: "Karen White",
    exam: "Database Management Systems",
    score: "45/100",
    percent: 45,
    status: "Fail",
    time: "06/03/2026, 12:00:00",
    email: "karen.w@university.edu",
    studentId: "STU-00009",
    examType: "MCQ + Coding",
    duration: "120 min",
    timeTaken: "120 min",
    submission: "2026-03-06 12:00",
    totalScore: 45,
    maxScore: 100,
    mcqScore: 4,
    mcqMaxScore: 10,
    codingScore: 21,
    codingMaxScore: 30,
    mcqCorrect: 2,
    mcqTotal: 5,
    codingProblems: 2,
    codingTestCases: { passed: 12, total: 20 },
    problems: [
      {
        title: "Problem 1: Complex SQL query with subqueries",
        language: "SQL",
        marks: "10/15 marks",
        code: `SELECT student_name, AVG(score) as avg_score
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN scores sc ON e.id = sc.enrollment_id
WHERE sc.score > (
    SELECT AVG(score) FROM scores
)
GROUP BY student_id`,
        testPassed: 5,
        testTotal: 10,
        status: "Partially Correct"
      },
      {
        title: "Problem 2: Database normalization",
        language: "SQL",
        marks: "11/15 marks",
        code: `-- Normalized schema for student enrollment
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100),
    credits INT
);`,
        testPassed: 7,
        testTotal: 10,
        status: "Partially Correct"
      }
    ]
  }
];
