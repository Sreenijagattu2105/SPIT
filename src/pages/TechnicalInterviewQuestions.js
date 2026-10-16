import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ChevronLeft} from "lucide-react";
const TechnicalInterviewQuestions = () => {
  const navigate = useNavigate();

  const isStudent =
    localStorage.getItem("isLoggedIn") === "true" &&
    localStorage.getItem("userRole") === "student";

  if (!isStudent) {
    return <Navigate to="/login" replace />;
  }

  const javaGroups = [
    {
      title: "1. Java Fundamentals and OOP",
      questions: [
        "What is Java, and what are its main features?",
        "Why is Java platform-independent?",
        "What is the difference between JDK, JRE, and JVM?",
        "Explain the four pillars of OOP.",
        "What is the difference between a class and an object?",
        "Explain encapsulation, abstraction, inheritance, and polymorphism.",
        "What is the difference between an abstract class and an interface?",
        "What is the difference between method overloading and overriding?",
        "What is compile-time polymorphism?",
        "What is runtime polymorphism?",
        "What is dynamic method dispatch?",
        "What is the difference between this and super?",
        "What is a constructor?",
        "What are default and parameterized constructors?",
        "Can constructors be overloaded or overridden?",
        "What is the difference between static and instance methods?",
        "What are static, instance, and local variables?",
        "Explain public, private, protected, and default access modifiers.",
        "What is the final keyword?",
        "Can the main method be overloaded?",
        "Can the main method be overridden?",
        "Does Java support multiple inheritance through classes?",
        "What is the difference between IS-A and HAS-A relationships?",
        "Explain aggregation and composition.",
        "What is a factory method?",
        "What are marker interfaces?",
        "What are generics in Java?",
        "What are enums?",
        "What is the difference between concrete and abstract methods?",
        "What are the important features introduced in Java 8, 11, and 17?",
        "What are lambda expressions?",
        "What is a functional interface?",
        "What is the Stream API?",
        "What are intermediate and terminal stream operations?",
        "What is Optional in Java?",
        "What are method references?",
        "What is the difference between == and equals()?",
        "What is the difference between equals() and hashCode()?"
      ]
    },
    {
      title: "2. Java Architecture and Memory Management",
      questions: [
        "Explain JVM architecture.",
        "How does the Java class loader work?",
        "What are the different class loader types?",
        "What is bytecode?",
        "How does Java execute a program?",
        "What is the JIT compiler?",
        "What is the difference between stack and heap memory?",
        "Where are objects stored in Java?",
        "What is garbage collection?",
        "How does garbage collection work?",
        "Can we force garbage collection?",
        "What causes memory leaks in Java?",
        "What is the String Constant Pool?",
        "What is the difference between new and newInstance()?",
        "What is reflection in Java?",
        "What are wrapper classes?",
        "What are autoboxing and unboxing?",
        "What is the difference between primitive and reference types?"
      ]
    },
    {
      title: "3. Strings, Objects and Language Features",
      questions: [
        "Why is String immutable in Java?",
        "What is the difference between String, StringBuilder, and StringBuffer?",
        "What is the difference between String concatenation and StringBuilder?",
        "What is object cloning?",
        "What is the Cloneable interface?",
        "What are serialization and deserialization?",
        "What is the transient keyword?",
        "What is the difference between shallow copy and deep copy?",
        "What is the difference between final, finally, and finalize()?",
        "What are instance and static initialization blocks?",
        "What is the difference between a static block and a constructor?",
        "What is the difference between an array and a collection?",
        "What are immutable objects?",
        "How do you create an immutable class?",
        "What is the difference between multitasking and multithreading?",
        "What are records and sealed classes in modern Java?"
      ]
    },
    {
      title: "4. Exception Handling",
      questions: [
        "What is an exception?",
        "What is the difference between Error and Exception?",
        "What is the difference between checked and unchecked exceptions?",
        "What is the difference between throw and throws?",
        "What are try, catch, and finally?",
        "Can we use multiple catch blocks?",
        "Can a try block exist without a catch block?",
        "Can a finally block fail to execute?",
        "What is a NullPointerException?",
        "What is an ArithmeticException?",
        "What is an ArrayIndexOutOfBoundsException?",
        "How do you create a custom exception?",
        "What is exception propagation?",
        "What is try-with-resources?",
        "What is the difference between FileNotFoundException and IOException?",
        "What happens when an exception is not handled?",
        "What are best practices for exception handling?"
      ]
    },
    {
      title: "5. Multithreading and Concurrency",
      questions: [
        "What is a thread?",
        "What is multithreading?",
        "What is the difference between a process and a thread?",
        "What are the thread life-cycle states?",
        "How do you create a thread in Java?",
        "What is the difference between Thread and Runnable?",
        "What is the difference between start() and run()?",
        "What is thread synchronization?",
        "What is thread safety?",
        "What is a race condition?",
        "What is a deadlock?",
        "What is the difference between sleep() and wait()?",
        "What are notify() and notifyAll()?",
        "What is the synchronized keyword?",
        "What is a daemon thread?",
        "What are thread priorities?",
        "What is the join() method?",
        "What is the volatile keyword?",
        "What is ExecutorService?",
        "What is a thread pool?",
        "What are Callable and Future?",
        "What is the difference between synchronized and Lock?",
        "What is CompletableFuture?"
      ]
    },
    {
      title: "6. Collections Framework",
      questions: [
        "What is the Java Collections Framework?",
        "What is the difference between Collection and Collections?",
        "Explain List, Set, Queue, and Map.",
        "What is the difference between ArrayList and LinkedList?",
        "What is the difference between ArrayList and Vector?",
        "What is the difference between List and Set?",
        "What is the difference between HashSet and TreeSet?",
        "What is the difference between HashMap and Hashtable?",
        "What is the difference between HashMap and TreeMap?",
        "How does HashMap work internally?",
        "What happens when two keys have the same hash code?",
        "Can HashMap contain null keys and values?",
        "What is the difference between Iterator and ListIterator?",
        "What is fail-fast behavior?",
        "What is ConcurrentHashMap?",
        "What are Comparable and Comparator?",
        "What is the difference between Comparable and Comparator?",
        "What are legacy collection classes?",
        "What is the Enumeration interface?",
        "What is the difference between Queue and Deque?",
        "What is PriorityQueue?",
        "What is LinkedHashMap?",
        "What are the advantages of generics in collections?"
      ]
    },
    {
      title: "7. Agile, Design and Software Engineering",
      questions: [
        "What is Agile methodology?",
        "What is the difference between Agile and Waterfall?",
        "What are the phases of the software development life cycle?",
        "What is a sprint in Agile?",
        "What are Scrum and the product backlog?",
        "What are SOLID principles?",
        "Explain the Single Responsibility Principle.",
        "Explain the Open/Closed Principle.",
        "Explain the Liskov Substitution Principle.",
        "Explain the Interface Segregation Principle.",
        "Explain the Dependency Inversion Principle.",
        "What are design patterns?",
        "What is the Singleton design pattern?",
        "What is the Factory design pattern?",
        "What is the difference between coupling and cohesion?",
        "What is unit testing?",
        "What is code review?",
        "What is version control?",
        "Why is documentation important?"
      ]
    }
  ];

  const frontendGroups = [
    {
      title: "HTML",
      questions: [
        "What is HTML, and why is it used?",
        "What is the difference between HTML and HTML5?",
        "What is the purpose of the DOCTYPE declaration?",
        "What are HTML elements and tags?",
        "What is the difference between block-level and inline elements?",
        "What are semantic HTML elements?",
        "What is the difference between div and span?",
        "What is the difference between id and class?",
        "What are void elements?",
        "What are ordered, unordered, and description lists?",
        "How do you create hyperlinks?",
        "What is the purpose of the target attribute?",
        "How do you insert images and videos?",
        "Why is the alt attribute important?",
        "What are HTML forms?",
        "Explain common HTML input types.",
        "What is the difference between GET and POST in forms?",
        "What are required, readonly, and disabled attributes?",
        "What is the purpose of the label element?",
        "How does HTML form validation work?",
        "What are thead, tbody, and tfoot?",
        "What is an iframe?",
        "What are meta tags?",
        "What is the difference between head and body?",
        "What are HTML entities?",
        "What are data-* attributes?",
        "What is the DOM?",
        "How do you improve HTML accessibility?",
        "How do you connect external CSS and JavaScript files?",
        "What is the difference between localStorage, sessionStorage, and cookies?"
      ]
    },
    {
      title: "CSS",
      questions: [
        "What is CSS, and why is it used?",
        "What are inline, internal, and external CSS?",
        "What are CSS selectors?",
        "Explain element, class, ID, universal, and attribute selectors.",
        "What are pseudo-classes and pseudo-elements?",
        "What is CSS specificity?",
        "What is the CSS box model?",
        "What is the difference between margin and padding?",
        "What is the difference between border and outline?",
        "What is the difference between display: none and visibility: hidden?",
        "Explain static, relative, absolute, fixed, and sticky positioning.",
        "What are block, inline, and inline-block elements?",
        "What is Flexbox?",
        "What are justify-content and align-items?",
        "What is the difference between Flexbox and CSS Grid?",
        "How do you create a responsive webpage?",
        "What are media queries?",
        "What is the difference between px, %, em, rem, vh, and vw?",
        "What are CSS transitions and animations?",
        "What is z-index?",
        "What is the overflow property?",
        "How do you horizontally and vertically center an element?",
        "What are CSS custom properties or variables?",
        "What is CSS inheritance?",
        "What is the difference between descendant and child selectors?",
        "What does !important do?",
        "How do you create gradients in CSS?",
        "How do hover effects work?",
        "What is the difference between opacity: 0 and display: none?",
        "How do you troubleshoot CSS styling issues?",
        "How do you prevent elements from overflowing their containers?",
        "What are min-width and max-width?",
        "What is the difference between transform and transition?",
        "How do you create a dropdown menu using CSS?",
        "How do you write maintainable CSS?"
      ]
    },
    {
      title: "Bootstrap",
      questions: [
        "What is Bootstrap?",
        "What are the advantages of Bootstrap?",
        "How do you include Bootstrap in a project?",
        "Explain the Bootstrap grid system.",
        "What are containers, rows, and columns?",
        "What are Bootstrap breakpoints?",
        "Explain col, col-sm, col-md, col-lg, and col-xl.",
        "What is the difference between container and container-fluid?",
        "How does Bootstrap support responsive design?",
        "How do you create a responsive navbar?",
        "What are Bootstrap utility classes?",
        "How do you style buttons using Bootstrap?",
        "How do you create forms and tables in Bootstrap?",
        "What are Bootstrap cards?",
        "How do spacing utilities such as mt-3 and p-2 work?",
        "How do you customize Bootstrap styles with CSS?",
        "What is the difference between Bootstrap 4 and Bootstrap 5?",
        "What is the purpose of the collapse component?",
        "How do you make a navbar collapse on mobile?",
        "What are Bootstrap modal, alert, and badge components?",
        "How do you align items using Bootstrap flex utilities?",
        "What is the difference between Bootstrap and writing CSS from scratch?"
      ]
    }
  ];

  const javascriptGroups = [
    {
      title: "1. JavaScript Fundamentals",
      questions: [
        "What is JavaScript, and where is it used?",
        "What are the different JavaScript data types?",
        "What is the difference between var, let, and const?",
        "What is the difference between == and ===?",
        "What is the difference between null and undefined?",
        "What are truthy and falsy values?",
        "What is type coercion?",
        "What is hoisting?",
        "What is the difference between global, function, and block scope?",
        "What is the difference between function declarations and function expressions?",
        "What are arrow functions?",
        "How does this behave in regular and arrow functions?",
        "What are template literals?",
        "What are destructuring, spread, and rest operators?",
        "What are default parameters?",
        "What is strict mode?",
        "What are optional chaining and the nullish coalescing operator?",
        "What is the difference between primitive and reference types?",
        "What is the difference between Object.freeze() and Object.seal()?",
        "How do you check whether a value is an array?",
        "What is a prototype in JavaScript?",
        "What are generators and iterators?",
        "What is the difference between Map and Object?",
        "What is the difference between Set and Array?"
      ]
    },
    {
      title: "2. Functions and Array Methods",
      questions: [
        "What are callback functions?",
        "What is a closure?",
        "What is a higher-order function?",
        "Explain map(), filter(), and reduce().",
        "What is the difference between map() and forEach()?",
        "What is the difference between find() and filter()?",
        "What is the difference between slice() and splice()?",
        "How do push(), pop(), shift(), and unshift() work?",
        "Explain call(), apply(), and bind().",
        "What is the difference between shallow copy and deep copy?",
        "How do you copy an object without modifying the original?",
        "What are debounce and throttle?",
        "What is the difference between function scope and block scope?",
        "What is the difference between a regular function and an arrow function?"
      ]
    },
    {
      title: "3. Asynchronous JavaScript",
      questions: [
        "What is the difference between synchronous and asynchronous JavaScript?",
        "What is a Promise? Explain its states.",
        "How do async and await work?",
        "How do you handle errors with try, catch, and finally?",
        "What is the JavaScript event loop?",
        "What are the call stack, task queue, and microtask queue?",
        "What are setTimeout() and setInterval()?",
        "What is the Fetch API?",
        "What is the difference between fetch() and Axios?",
        "What are HTTP methods such as GET, POST, PUT, PATCH, and DELETE?",
        "What is the difference between a Promise chain and async/await?",
        "How does JavaScript handle asynchronous API responses?",
        "What is the difference between Promise.all() and Promise.allSettled()?",
        "What happens when a Promise is rejected?",
        "What is the difference between synchronous errors and Promise rejections?"
      ]
    },
    {
      title: "4. DOM, Events and Browser Storage",
      questions: [
        "What is the DOM, and how do you manipulate it?",
        "What are JavaScript events?",
        "What is the difference between event bubbling and capturing?",
        "What is event delegation?",
        "What is addEventListener()?",
        "What is the difference between preventDefault() and stopPropagation()?",
        "What is JSON?",
        "How do JSON.parse() and JSON.stringify() work?",
        "How do localStorage and sessionStorage work?",
        "What is the difference between cookies and localStorage?",
        "How do you validate form input using JavaScript?",
        "What are JavaScript modules? Explain import and export.",
        "What are memory leaks in JavaScript?",
        "How do you remove an event listener?",
        "What is the difference between innerHTML and textContent?"
      ]
    }
  ];

  const reactGroups = [
    {
      title: "1. React Fundamentals",
      questions: [
        "What is React, and why is it used?",
        "What are the main features of React?",
        "What is a React component?",
        "What is JSX?",
        "What is the difference between functional and class components?",
        "What are props?",
        "What is state in React?",
        "What is the difference between props and state?",
        "What is the Virtual DOM?",
        "What is reconciliation?",
        "Why are keys important when rendering lists?",
        "What is conditional rendering?",
        "What are React fragments?",
        "What is one-way data flow?",
        "What is component composition?",
        "What is lifting state up?",
        "Why should state not be mutated directly?",
        "How do you render a list using map()?",
        "What is the difference between controlled and uncontrolled components?",
        "What happens when a React component re-renders?",
        "What is the purpose of StrictMode?",
        "What is the difference between a component and an element?",
        "How do you pass props to a child component?",
        "How do you share data between sibling components?",
        "What is the purpose of the key prop?"
      ]
    },
    {
      title: "2. React Hooks",
      questions: [
        "What are React Hooks?",
        "What is useState()?",
        "What is useEffect()?",
        "How does the dependency array in useEffect() work?",
        "What is the cleanup function in useEffect()?",
        "What is useContext()?",
        "What is useRef()?",
        "What is the difference between useRef() and useState()?",
        "What is useMemo()?",
        "What is useCallback()?",
        "What are custom Hooks?",
        "What are the Rules of Hooks?",
        "When should you avoid using useMemo() and useCallback()?",
        "How can useEffect() cause an infinite loop?",
        "What is the difference between useEffect() and useLayoutEffect()?",
        "How do you create a custom Hook?",
        "Can Hooks be called inside conditions or loops?",
        "How do you clean up event listeners in useEffect()?"
      ]
    },
    {
      title: "3. React Forms, Events and API Integration",
      questions: [
        "How do you handle events in React?",
        "How do you handle forms in React?",
        "How do you validate form fields?",
        "How do you pass data from a child component to a parent?",
        "How do you fetch data from an API in React?",
        "How do you use Axios in React?",
        "How do you display loading and error states?",
        "How do you submit data to a backend API?",
        "How do you update and delete records using API requests?",
        "How do you prevent a form from refreshing the page?",
        "How do you handle API errors?",
        "How do you avoid making duplicate API requests?",
        "How do you bind input fields to state?",
        "How do you handle checkboxes and dropdowns in React?",
        "How do you reset a form after submission?",
        "How do you display API data using map()?",
        "How do you handle HTTP status codes?",
        "How do you send headers with Axios requests?",
        "How do you organize API calls in a separate service file?",
        "What is the difference between fetch() and Axios in React?"
      ]
    },
    {
      title: "4. React Routing and Advanced Concepts",
      questions: [
        "What is React Router?",
        "What is the difference between Link and NavLink?",
        "What is useNavigate()?",
        "How do you pass URL parameters to a component?",
        "How do you pass navigation state?",
        "How do you implement protected routes?",
        "How can you implement role-based access in a React application?",
        "What is the Context API?",
        "What is prop drilling, and how can it be avoided?",
        "What are error boundaries?",
        "What are React.lazy() and Suspense?",
        "What is React.memo()?",
        "What causes unnecessary re-renders?",
        "How do you improve React application performance?",
        "What is the difference between client-side routing and server-side routing?",
        "What is the purpose of package.json?",
        "What are npm start, npm run build, and npm install?",
        "How do you organize folders in a React project?",
        "How do you store and retrieve login information in localStorage?",
        "What are common React debugging techniques?",
        "What is the difference between development and production builds?",
        "How do you handle environment variables in a React application?",
        "What is the difference between a state update and a normal variable update?",
        "How do you handle a page that does not exist using React Router?",
        "What is the difference between Context API and prop drilling?",
        "What is code splitting?",
        "What is the purpose of React Developer Tools?",
        "How do you handle authentication state after login and logout?",
        "What are common reasons a component renders more than once?",
        "How do you structure reusable components?"
      ]
    }
  ];

  const sqlGroups = [
    {
      title: "1. Database Fundamentals",
      questions: [
        "What is a database?",
        "What is a DBMS?",
        "What is an RDBMS?",
        "What is the difference between DBMS and RDBMS?",
        "What is MySQL?",
        "What is a table, row, column, and schema?",
        "What are primary keys and foreign keys?",
        "What is a candidate key?",
        "What is a composite key?",
        "What is a unique constraint?",
        "What is the difference between NULL, zero, and an empty string?",
        "What are database relationships?",
        "Explain one-to-one, one-to-many, and many-to-many relationships.",
        "What is referential integrity?",
        "What is an ER diagram?"
      ]
    },
    {
      title: "2. SQL Commands and Queries",
      questions: [
        "What is SQL?",
        "Explain DDL, DML, DQL, DCL, and TCL commands.",
        "What is the difference between DELETE, DROP, and TRUNCATE?",
        "What is the difference between WHERE and HAVING?",
        "What is the difference between GROUP BY and ORDER BY?",
        "How do you insert a record into a table?",
        "How do you update an existing record?",
        "How do you delete a specific record?",
        "How do you retrieve distinct values?",
        "How do you filter records using LIKE?",
        "What are BETWEEN, IN, and EXISTS?",
        "What are aggregate functions?",
        "Explain COUNT(), SUM(), AVG(), MIN(), and MAX().",
        "What is the difference between COUNT(*) and COUNT(column_name)?",
        "How do you find the second-highest salary?",
        "How do you find duplicate records?",
        "How do you remove duplicate records?",
        "How do you find the highest salary in each department?",
        "How do you retrieve the first N records?",
        "What are aliases in SQL?",
        "What is the difference between UNION and UNION ALL?",
        "What is a subquery?",
        "What is a correlated subquery?",
        "How do you use CASE in SQL?",
        "What is the difference between IN and EXISTS?",
        "What are window functions?",
        "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER()?"
      ]
    },
    {
      title: "3. Joins and Relationships",
      questions: [
        "What is a JOIN?",
        "Explain INNER JOIN.",
        "Explain LEFT JOIN and RIGHT JOIN.",
        "What is a CROSS JOIN?",
        "What is a self join?",
        "What is the difference between INNER JOIN and LEFT JOIN?",
        "What is the difference between a join and a subquery?",
        "How do you retrieve records that have no matching record in another table?",
        "How do you join three tables?",
        "What is a natural join?",
        "What is the difference between a primary key and a foreign key?",
        "How do you retrieve student names along with their department names?",
        "How do you find employees who do not belong to any department?",
        "How do you find departments with no employees?"
      ]
    },
    {
      title: "4. Constraints, Normalization and Indexes",
      questions: [
        "What are SQL constraints?",
        "Explain NOT NULL, UNIQUE, CHECK, DEFAULT, PRIMARY KEY, and FOREIGN KEY.",
        "What is AUTO_INCREMENT in MySQL?",
        "What is normalization?",
        "Explain first, second, and third normal forms.",
        "What is denormalization?",
        "What is an index?",
        "What are the advantages and disadvantages of indexes?",
        "What is the difference between clustered and non-clustered indexes conceptually?",
        "What is a composite index?",
        "What is a view?",
        "What is a stored procedure?",
        "What is a trigger?",
        "What is a cursor?",
        "What is the difference between CHAR and VARCHAR?",
        "Why is a phone number generally stored as VARCHAR instead of INT?",
        "What is the difference between DATE, TIME, DATETIME, and TIMESTAMP in MySQL?",
        "What is a default constraint?",
        "What is cascading update or delete?",
        "How do indexes affect INSERT, UPDATE, and DELETE operations?"
      ]
    },
    {
      title: "5. Transactions and Database Design",
      questions: [
        "What is a transaction?",
        "Explain the ACID properties.",
        "What are COMMIT and ROLLBACK?",
        "What is a SAVEPOINT?",
        "What is transaction isolation?",
        "What are dirty reads, non-repeatable reads, and phantom reads?",
        "What is a deadlock in a database?",
        "How do you design tables for a hospital management system?",
        "How do you design tables for student and course management?",
        "How do you prevent duplicate records?",
        "How do you back up and restore a MySQL database?",
        "How do you improve a slow SQL query?",
        "What is the difference between logical and physical database design?",
        "What is connection pooling?"
      ]
    },
    {
      title: "6. SQL with Java and JDBC",
      questions: [
        "What is JDBC?",
        "What are the steps to connect Java to MySQL?",
        "What is DriverManager?",
        "What is a Connection object?",
        "What is the difference between Statement and PreparedStatement?",
        "What is a ResultSet?",
        "How do you insert, update, and delete records using JDBC?",
        "What is SQL injection?",
        "How does PreparedStatement help prevent SQL injection?",
        "How do you handle transactions in JDBC?",
        "What are commit(), rollback(), and setAutoCommit()?",
        "What are ResultSetMetaData and DatabaseMetaData?",
        "Why should database resources be closed after use?",
        "How do you retrieve generated IDs after inserting a record?",
        "How do you handle SQLException?",
        "What is the difference between executeQuery() and executeUpdate()?",
        "What is the purpose of execute()?"
      ]
    }
  ];

  const springGroups = [
    {
      title: "1. Spring and Spring Boot Fundamentals",
      questions: [
        "What is Spring Framework?",
        "What is Spring Boot?",
        "What is the difference between Spring and Spring Boot?",
        "What are the advantages of Spring Boot?",
        "What is Inversion of Control (IoC)?",
        "What is Dependency Injection (DI)?",
        "What are the different types of dependency injection?",
        "What is an IoC container?",
        "What is a Spring bean?",
        "What is the Spring application context?",
        "What is auto-configuration?",
        "What does @SpringBootApplication do?",
        "What is component scanning?",
        "What is the purpose of Spring Boot starters?",
        "What is Spring Initializr?",
        "How do you run a Spring Boot application?",
        "What is the difference between an embedded server and an external server?",
        "How do you change the default server port?",
        "What is the purpose of application.properties?",
        "What is the purpose of the main method in Spring Boot?"
      ]
    },
    {
      title: "2. Spring Annotations and Dependency Injection",
      questions: [
        "What is the purpose of @Component?",
        "What is the difference between @Component, @Service, and @Repository?",
        "What is @Controller?",
        "What is @RestController?",
        "What is @Autowired?",
        "What is @Qualifier?",
        "What is @Primary?",
        "What is @Bean?",
        "What is the difference between @Bean and @Component?",
        "What is @Configuration?",
        "What is @Value?",
        "What is @ConfigurationProperties?",
        "Why is constructor injection commonly recommended?",
        "What is bean scope?",
        "What is the difference between singleton and prototype bean scopes?",
        "What is @Lazy?",
        "What is @Scope?",
        "What happens if Spring cannot find a required bean?",
        "How does Spring resolve dependencies between beans?"
      ]
    },
    {
      title: "3. REST APIs and Request Handling",
      questions: [
        "How do you create a REST API using Spring Boot?",
        "What is the difference between @Controller and @RestController?",
        "What is @RequestMapping?",
        "Explain @GetMapping, @PostMapping, @PutMapping, @PatchMapping, and @DeleteMapping.",
        "What is @PathVariable?",
        "What is @RequestParam?",
        "What is @RequestBody?",
        "What is @ResponseBody?",
        "What is ResponseEntity?",
        "How do you return different HTTP status codes?",
        "What is the difference between PUT and PATCH?",
        "How do you handle request validation?",
        "What are @Valid and validation annotations?",
        "How do you handle exceptions globally?",
        "What is @ControllerAdvice?",
        "What is @ExceptionHandler?",
        "How do you enable CORS in Spring Boot?",
        "How do you test REST endpoints?",
        "How do you return JSON from a controller?",
        "How do you implement pagination in a REST API?",
        "What is the difference between HTTP 400, 401, 403, 404, and 500?"
      ]
    },
    {
      title: "4. Spring Boot with MySQL, JPA and Hibernate",
      questions: [
        "How do you connect Spring Boot to MySQL?",
        "What is Spring Data JPA?",
        "What is Hibernate?",
        "What is the difference between JPA and Hibernate?",
        "What is an entity class?",
        "What is @Entity?",
        "What are @Id and @GeneratedValue?",
        "What is @Table?",
        "What is @Column?",
        "What are @OneToOne, @OneToMany, @ManyToOne, and @ManyToMany?",
        "What is JpaRepository?",
        "What methods does JpaRepository provide?",
        "How do you write a custom query using @Query?",
        "What are derived query methods?",
        "What is the difference between save(), findById(), and findAll()?",
        "How do you update and delete database records?",
        "What is @Transactional?",
        "What is lazy loading versus eager loading?",
        "What is the N+1 query problem?",
        "What is the purpose of spring.jpa.hibernate.ddl-auto?",
        "What is the difference between CrudRepository and JpaRepository?",
        "What is the persistence context?",
        "What are transient, persistent, detached, and removed entity states?",
        "What is cascading in JPA?",
        "What is orphan removal?",
        "How do you implement pagination and sorting with Spring Data JPA?",
        "How do you configure a database connection in application.properties?"
      ]
    },
    {
      title: "5. Configuration, Security and Testing",
      questions: [
        "What is the difference between application.properties and application.yml?",
        "What are Spring profiles?",
        "How do you configure different environments?",
        "How can environment variables be used for configuration?",
        "How do you avoid exposing database passwords in source code?",
        "What is Spring Security?",
        "What is the difference between authentication and authorization?",
        "What is JWT, and how can it be used for authentication?",
        "What is password hashing?",
        "What is Spring Boot Actuator?",
        "What are health and metrics endpoints?",
        "What is the difference between unit testing and integration testing?",
        "What are JUnit and Mockito?",
        "What is @SpringBootTest?",
        "What is MockMvc?",
        "How do you test a service class?",
        "How do you package a Spring Boot application as a JAR?",
        "How do you run a Spring Boot JAR file?",
        "How do you troubleshoot application startup errors?",
        "How do you organize controller, service, repository, and entity layers?",
        "What is the difference between @WebMvcTest and @SpringBootTest?",
        "How do you mock a repository in a service test?",
        "How do you configure logging in Spring Boot?",
        "How do you handle application-specific exceptions?",
        "What is the purpose of a DTO?",
        "Why should entities not always be returned directly from controllers?",
        "How do you document REST APIs using OpenAPI or Swagger?"
      ]
    }
  ];

  const restQuestions = [
    "What is REST?",
    "What are RESTful web services?",
    "What are the principles of REST?",
    "What is the difference between REST and SOAP?",
    "What is a resource in REST?",
    "What is the purpose of a URI?",
    "Explain GET, POST, PUT, PATCH, and DELETE.",
    "What is the difference between safe and idempotent HTTP methods?",
    "What are HTTP status codes?",
    "What is the difference between request headers and request bodies?",
    "What is JSON?",
    "What is content negotiation?",
    "What is CORS?",
    "What is API versioning?",
    "What is pagination?",
    "How do you handle API errors?",
    "What is authentication versus authorization?",
    "How do you test APIs using Postman?",
    "What is the difference between query parameters and path parameters?",
    "How do you secure a REST API?"
  ];

  const computerScienceQuestions = [
    "What is an operating system?",
    "What is the difference between a process and a thread?",
    "What is virtual memory?",
    "What is deadlock, and what are its necessary conditions?",
    "What is the difference between TCP and UDP?",
    "What is the difference between HTTP and HTTPS?",
    "What is DNS?",
    "What is an IP address?",
    "What is the difference between a compiler and an interpreter?",
    "What is the difference between authentication and authorization?",
    "What is normalization in databases?",
    "What is the software development life cycle?",
    "What is unit testing?",
    "What is integration testing?",
    "What is debugging?",
    "What is the difference between frontend and backend development?",
    "What is client-server architecture?",
    "What is cloud computing?",
    "What is the difference between scalability and availability?",
    "What is version control?"
  ];

  const gitQuestions = [
    "What is Git?",
    "What is GitHub?",
    "What is the difference between Git and GitHub?",
    "What is a repository?",
    "What is the difference between a local and remote repository?",
    "What are git init, git clone, and git status?",
    "What is the difference between git add and git commit?",
    "What is git push?",
    "What is git pull?",
    "What is git fetch?",
    "What is a branch?",
    "How do you create and switch branches?",
    "What is merging?",
    "What is a merge conflict?",
    "How do you resolve merge conflicts?",
    "What is the difference between git merge and git rebase?",
    "What is .gitignore?",
    "What is a pull request?",
    "What is forking?",
    "What is the difference between git reset and git revert?",
    "What is git stash?",
    "How do you view commit history?",
    "How do you collaborate using GitHub?",
    "How do you revert a commit safely?",
    "What is a README file?"
  ];

  
  const cGroups = [
    {
      title: "1. C Fundamentals",
      questions: [
        "What is C, and what are its main features?",
        "What is the structure of a C program?",
        "What are keywords and identifiers in C?",
        "What are the basic data types in C?",
        "What is the difference between declaration and initialization?",
        "What is the difference between local and global variables?",
        "What are constants and literals?",
        "What is the difference between printf() and scanf()?",
        "What are format specifiers in C?",
        "What is type casting?",
        "What is the difference between implicit and explicit type conversion?",
        "What are operators in C?",
        "What is the difference between = and ==?",
        "What is the difference between while and do-while loops?",
        "What is the difference between break and continue?",
        "What is recursion?",
        "What is the difference between call by value and call by reference?"
      ]
    },
    {
      title: "2. C Functions, Arrays and Pointers",
      questions: [
        "What is a function in C?",
        "What are function declaration, definition, and calling?",
        "What are actual and formal parameters?",
        "What is a storage class in C?",
        "What is the difference between auto, static, extern, and register?",
        "What is an array?",
        "What is the difference between one-dimensional and two-dimensional arrays?",
        "How do you pass an array to a function?",
        "What is a string in C?",
        "What is the difference between a character array and a string?",
        "What is a pointer?",
        "What is a NULL pointer?",
        "What is a void pointer?",
        "What is a dangling pointer?",
        "What is pointer arithmetic?",
        "What is the relationship between arrays and pointers?",
        "What are function pointers?"
      ]
    },
    {
      title: "3. C Memory Management and Structures",
      questions: [
        "What is a structure in C?",
        "What is the difference between a structure and a union?",
        "What is an enum?",
        "What is a typedef?",
        "What are nested structures?",
        "What is dynamic memory allocation?",
        "Explain malloc(), calloc(), realloc(), and free().",
        "What is a memory leak?",
        "What is the difference between stack and heap memory?",
        "What are header files?",
        "What is the purpose of the preprocessor?",
        "What are macros in C?",
        "What is file handling in C?",
        "Explain fopen(), fclose(), fprintf(), and fscanf().",
        "What is the difference between text and binary files?"
      ]
    }
  ];

  const cppGroups = [
    {
      title: "1. C++ Fundamentals and OOP",
      questions: [
        "What is C++, and how is it different from C?",
        "What are the main features of C++?",
        "What is a class and an object?",
        "What are the four pillars of OOP?",
        "What is encapsulation?",
        "What is abstraction?",
        "What is inheritance?",
        "What is polymorphism?",
        "What are the different types of inheritance in C++?",
        "What is multiple inheritance?",
        "What is a constructor?",
        "What is a destructor?",
        "Can constructors be overloaded?",
        "What is the difference between a constructor and a destructor?",
        "What is function overloading?",
        "What is operator overloading?",
        "What is function overriding?",
        "What is a virtual function?",
        "What is a pure virtual function?",
        "What is an abstract class?",
        "What is the difference between public, private, and protected?",
        "What is the difference between struct and class in C++?"
      ]
    },
    {
      title: "2. C++ Pointers, Memory and Advanced Features",
      questions: [
        "What is the difference between a pointer and a reference?",
        "What is the this pointer?",
        "What is a smart pointer?",
        "What is dynamic memory allocation in C++?",
        "What is the difference between new/delete and malloc()/free()?",
        "What is the difference between shallow copy and deep copy?",
        "What is a copy constructor?",
        "What is the difference between pass by value and pass by reference?",
        "What are templates in C++?",
        "What is the Standard Template Library (STL)?",
        "What are vector, list, map, and set?",
        "What are iterators?",
        "What is exception handling in C++?",
        "What are try, catch, and throw?",
        "What is the difference between compile-time and runtime polymorphism?",
        "What are namespaces?",
        "What is the difference between #include <iostream> and #include <stdio.h>?",
        "What are lambda expressions in C++?",
        "What is the purpose of auto?",
        "What are move semantics and rvalue references?"
      ]
    }
  ];

  const pythonGroups = [
    {
      title: "1. Python Fundamentals",
      questions: [
        "What is Python, and what are its main features?",
        "Is Python compiled or interpreted?",
        "What are the built-in data types in Python?",
        "What is the difference between a list, tuple, set, and dictionary?",
        "What is the difference between mutable and immutable objects?",
        "What is the difference between == and is?",
        "What is indentation, and why is it important in Python?",
        "What are variables and naming rules in Python?",
        "What are type conversion and type checking?",
        "What is slicing in Python?",
        "What is negative indexing?",
        "What is the difference between range() and xrange()?",
        "What are conditional statements in Python?",
        "What is the difference between for and while loops?",
        "What are break, continue, and pass?",
        "What are *args and **kwargs?",
        "What is a lambda function?",
        "What is list comprehension?",
        "What is a module?",
        "What is a Python package?"
      ]
    },
    {
      title: "2. Python Functions, OOP and Exception Handling",
      questions: [
        "How do you define and call a function in Python?",
        "What is the difference between a parameter and an argument?",
        "What is recursion in Python?",
        "What is a decorator?",
        "What is a generator?",
        "What does the yield keyword do?",
        "What is an iterator?",
        "What is object-oriented programming in Python?",
        "What are classes and objects?",
        "What is the purpose of __init__()?",
        "What is self in Python?",
        "What is inheritance in Python?",
        "What is multiple inheritance?",
        "What is method overriding?",
        "What is the difference between instance, class, and static methods?",
        "What are public, protected, and private naming conventions?",
        "What is exception handling?",
        "What are try, except, else, and finally?",
        "How do you create a custom exception?",
        "What is the difference between del, remove(), and pop()?"
      ]
    },
    {
      title: "3. Python Files, Libraries and Practical Concepts",
      questions: [
        "How do you open and close a file in Python?",
        "What is the with statement?",
        "What is the difference between read(), readline(), and readlines()?",
        "How do you handle files and directories?",
        "What is pip?",
        "What is a virtual environment?",
        "What is the difference between shallow copy and deep copy?",
        "What are map(), filter(), and reduce()?",
        "What is the difference between append() and extend()?",
        "What is the difference between sort() and sorted()?",
        "What is the purpose of __name__ == '__main__'?",
        "What is PEP 8?",
        "What is the Global Interpreter Lock (GIL)?",
        "What is the difference between multithreading and multiprocessing?",
        "How do you handle JSON data in Python?",
        "How do you connect Python to a database?",
        "How do you install and import external libraries?",
        "How do you debug a Python program?"
      ]
    }
  ];

  const csharpGroups = [
    {
      title: "1. C# Fundamentals and OOP",
      questions: [
        "What is C#, and where is it used?",
        "What are the main features of C#?",
        "What is the difference between C# and C++?",
        "What is the .NET Framework?",
        "What is the difference between .NET Framework and modern .NET?",
        "What are CLR, CTS, and CLS?",
        "What is managed code?",
        "What is the difference between value types and reference types?",
        "What is boxing and unboxing?",
        "What is the difference between class and struct?",
        "What are the four pillars of OOP?",
        "What is the difference between an abstract class and an interface?",
        "What is the difference between method overloading and overriding?",
        "What are virtual, override, and new keywords?",
        "What is a constructor?",
        "What is a static constructor?",
        "What is the difference between const and readonly?",
        "What are access modifiers in C#?",
        "What is a sealed class?",
        "What are properties and auto-implemented properties?"
      ]
    },
    {
      title: "2. C# Collections, LINQ and Exception Handling",
      questions: [
        "What is the difference between an array and a List<T>?",
        "What are generics in C#?",
        "What is the difference between IEnumerable and IQueryable?",
        "What is LINQ?",
        "What are lambda expressions in C#?",
        "What is the difference between Select() and Where() in LINQ?",
        "What is the difference between First(), FirstOrDefault(), and SingleOrDefault()?",
        "What are delegates?",
        "What are events in C#?",
        "What is the difference between a delegate and an event?",
        "What is exception handling in C#?",
        "What is the difference between throw and throw ex?",
        "What is the purpose of finally?",
        "What are custom exceptions?",
        "What is the difference between string and StringBuilder?",
        "Why is string immutable in C#?",
        "What are nullable value types?",
        "What is the difference between ref, out, and in?",
        "What are extension methods?",
        "What are async and await?"
      ]
    },
    {
      title: "3. C# and .NET Application Development",
      questions: [
        "What is garbage collection in .NET?",
        "What is IDisposable?",
        "What is the purpose of the using statement?",
        "What is dependency injection?",
        "What are the types of dependency injection?",
        "What is the difference between transient, scoped, and singleton services?",
        "What is ASP.NET Core?",
        "What is the difference between MVC and Web API?",
        "What is middleware in ASP.NET Core?",
        "What is Entity Framework Core?",
        "What is the difference between Code First and Database First?",
        "What are migrations in Entity Framework Core?",
        "What is asynchronous programming?",
        "What is the difference between Task and Thread?",
        "What is unit testing in .NET?",
        "What are common ways to debug a C# application?",
        "How do you connect a .NET application to a database?",
        "What is REST API development in ASP.NET Core?"
      ]
    }
  ];

  const phpGroups = [
    {
      title: "1. PHP Fundamentals",
      questions: [
        "What is PHP, and where is it used?",
        "What are the main features of PHP?",
        "How do you declare variables in PHP?",
        "What are the basic data types in PHP?",
        "What is the difference between echo and print?",
        "What is the difference between == and === in PHP?",
        "What are indexed, associative, and multidimensional arrays?",
        "What is the difference between isset() and empty()?",
        "What are PHP constants?",
        "What are conditional statements in PHP?",
        "What are the different types of loops in PHP?",
        "What is the difference between include and require?",
        "What is the difference between include_once and require_once?",
        "How do you define and call a function in PHP?",
        "What are variable scopes in PHP?",
        "What are superglobal variables?",
        "What are $_GET and $_POST?",
        "What is the difference between GET and POST?",
        "What is the purpose of $_SERVER?",
        "How do you validate form input in PHP?"
      ]
    },
    {
      title: "2. PHP OOP, Sessions and Database Connectivity",
      questions: [
        "What is object-oriented programming in PHP?",
        "How do you create a class and object in PHP?",
        "What are constructors and destructors in PHP?",
        "What are public, private, and protected access modifiers?",
        "What is inheritance in PHP?",
        "What is an interface in PHP?",
        "What is an abstract class?",
        "What is the difference between an interface and an abstract class?",
        "What are traits in PHP?",
        "What is method overriding?",
        "What is the difference between == and the instanceof operator?",
        "What is the difference between sessions and cookies?",
        "How do you start and destroy a PHP session?",
        "How do you set and retrieve cookies?",
        "How do you connect PHP to MySQL?",
        "What is the difference between MySQLi and PDO?",
        "What is a prepared statement?",
        "How do prepared statements help prevent SQL injection?",
        "How do you handle errors and exceptions in PHP?",
        "How do you upload a file using PHP?",
        "How do you encode and decode JSON in PHP?",
        "How do you create a REST API using PHP?"
      ]
    }
  ];


  const QuestionGroup = ({ title, questions }) => (
    <div className="technical-question-box">
      <h3>{title}</h3>
      <ul>
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="resource-detail-page">
      <div className="resource-detail-container">
       
        <div className="resource-detail-intro">
          <h1>TECHNICAL INTERVIEW QUESTIONS</h1>
          <p className="technical-intro-description">
            Prepare for technical interviews with questions covering Java,
            HTML, CSS, Bootstrap, JavaScript, React, SQL, Spring Boot,
            REST APIs, computer science fundamentals, and Git.
          </p>
        </div>

        <div className="resource-section">
          <h2>Java Interview Questions</h2>
          {javaGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>

        {frontendGroups.map((group) => (
          <div className="resource-section" key={group.title}>
            <h2>{group.title} Interview Questions</h2>
            <ul>
              {group.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className="resource-section">
          <h2>JavaScript Interview Questions</h2>
          {javascriptGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>

        <div className="resource-section">
          <h2>React Interview Questions</h2>
          {reactGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>

        <div className="resource-section">
          <h2>SQL and Databases Interview Questions</h2>
          {sqlGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>

        <div className="resource-section">
          <h2>Spring Boot Interview Questions</h2>
          {springGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>

        <div className="resource-section">
          <h2>REST API Interview Questions</h2>
          <ul>
            {restQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>

        <div className="resource-section">
          <h2>Computer Science Fundamentals</h2>
          <ul>
            {computerScienceQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>

        <div className="resource-section">
          <h2>Git and GitHub Interview Questions</h2>
          <ul>
            {gitQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>

        
        <div className="resource-section">
          <h2>C Programming Interview Questions</h2>
          {cGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>

        <div className="resource-section">
          <h2>C++ Interview Questions</h2>
          {cppGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>

        <div className="resource-section">
          <h2>Python Interview Questions</h2>
          {pythonGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>

        <div className="resource-section">
          <h2>C# Interview Questions</h2>
          {csharpGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>

        <div className="resource-section">
          <h2>PHP Interview Questions</h2>
          {phpGroups.map((group) => (
            <QuestionGroup
              key={group.title}
              title={group.title}
              questions={group.questions}
            />
          ))}
        </div>
 {/* Back button at the bottom */}
        <button
          className="back-resource-button"
          onClick={() => navigate("/career-resources")}
        >
         <ChevronLeft size={18} />  Back to Career Resources
        </button>
      </div>
    </div>
  );
};

export default TechnicalInterviewQuestions;
