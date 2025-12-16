# תרשים זרימה ויזואלי - מנגנון יצירת קורס

## 🎯 תרשים זרימה ראשי (Mermaid)

```mermaid
flowchart TD
    A[📥 INPUT SOURCES] --> B[🔧 DATA PROCESSING]
    B --> C[📋 CONTENT INTEGRATION]
    C --> D[🎨 ASSET GENERATION]
    D --> E[📤 OUTPUT DELIVERY]
    
    A --> A1[course_iot_masterpiece.json]
    A --> A2[course_iot_masterpiece.md]
    A --> A3[Configuration Files]
    
    B --> B1[JSON Validation & Loading]
    B --> B2[Markdown Processing]
    B --> B3[Hebrew Text Reshaping]
    B --> B4[Content Structure Analysis]
    
    C --> C1[Session Data Mapping]
    C --> C2[Assignment Integration]
    C --> C3[Metadata Extraction]
    C --> C4[Multi-format Preparation]
    
    D --> D1[PDF Generation]
    D --> D2[PowerPoint Creation]
    D --> D3[Multi-language Support]
    
    E --> E1[course_iot_syllabus.pdf]
    E --> E2[course_iot_master_slides.pptx]
    E --> E3[session_pdfs_improved/]
```

## 🔄 תרשים זרימה מפורט

```mermaid
graph TD
    Start([🚀 START]) --> LoadConfig[📋 Load Configuration]
    LoadConfig --> ValidatePaths{🔍 Validate Paths?}
    
    ValidatePaths -->|❌ Invalid| ErrorExit[❌ Exit with Error]
    ValidatePaths -->|✅ Valid| LoadJSON[📄 Load JSON File]
    
    LoadJSON --> ValidateJSON{🔍 Validate JSON Schema?}
    ValidateJSON -->|❌ Invalid| ErrorExit
    ValidateJSON -->|✅ Valid| LoadMD[📝 Load Markdown File]
    
    LoadMD --> ProcessHebrew[🔤 Process Hebrew Text]
    ProcessHebrew --> MapSessions[🗺️ Map Sessions Structure]
    
    MapSessions --> IntegrateAssignments[📚 Integrate Assignments]
    IntegrateAssignments --> CreateUnifiedStructure[🏗️ Create Unified Structure]
    
    CreateUnifiedStructure --> GeneratePDF[📄 Generate Main PDF]
    GeneratePDF --> GenerateSessionPDFs[📑 Generate Session PDFs]
    GenerateSessionPDFs --> GeneratePPTX[📊 Generate PowerPoint]
    
    GeneratePPTX --> ValidateOutputs{🔍 Validate Outputs?}
    ValidateOutputs -->|❌ Invalid| ErrorExit
    ValidateOutputs -->|✅ Valid| Success([✅ SUCCESS])
    
    ErrorExit --> End([🔚 END])
    Success --> End
```

## 🧩 תרשים ארכיטקטורה מפורט

```mermaid
graph LR
    subgraph "📥 INPUT LAYER"
        JSON[JSON Course Data]
        MD[Markdown Content]
        CONFIG[Configuration]
    end
    
    subgraph "🔧 PROCESSING LAYER"
        VALIDATOR[Data Validator]
        PARSER[Content Parser]
        HEBREW[Hebrew Processor]
        MAPPER[Structure Mapper]
    end
    
    subgraph "📋 INTEGRATION LAYER"
        SESSION_INT[Session Integrator]
        ASSIGN_INT[Assignment Integrator]
        META_EXT[Metadata Extractor]
        CONTENT_UNIFY[Content Unifier]
    end
    
    subgraph "🎨 GENERATION LAYER"
        PDF_GEN[PDF Generator]
        PPTX_GEN[PPTX Generator]
        MULTI_LANG[Multi-language Handler]
    end
    
    subgraph "📤 OUTPUT LAYER"
        MAIN_PDF[Main Syllabus PDF]
        SESSION_PDFS[Session PDFs]
        PRESENTATION[PowerPoint Slides]
    end
    
    JSON --> VALIDATOR
    MD --> PARSER
    CONFIG --> HEBREW
    
    VALIDATOR --> SESSION_INT
    PARSER --> ASSIGN_INT
    HEBREW --> META_EXT
    MAPPER --> CONTENT_UNIFY
    
    SESSION_INT --> PDF_GEN
    ASSIGN_INT --> PPTX_GEN
    META_EXT --> MULTI_LANG
    CONTENT_UNIFY --> PDF_GEN
    
    PDF_GEN --> MAIN_PDF
    PDF_GEN --> SESSION_PDFS
    PPTX_GEN --> PRESENTATION
```

## 🔀 תרשים זרימת נתונים

```mermaid
sequenceDiagram
    participant Main as Main Process
    participant Loader as Data Loader
    participant Processor as Content Processor
    participant Generator as Asset Generator
    participant Output as Output Manager
    
    Main->>Loader: Load JSON & MD files
    Loader->>Loader: Validate file existence
    Loader->>Loader: Parse JSON structure
    Loader-->>Main: Return parsed data
    
    Main->>Processor: Process content
    Processor->>Processor: Reshape Hebrew text
    Processor->>Processor: Map sessions structure
    Processor->>Processor: Integrate assignments
    Processor-->>Main: Return processed content
    
    Main->>Generator: Generate assets
    Generator->>Generator: Create main PDF
    Generator->>Generator: Create session PDFs
    Generator->>Generator: Create PowerPoint
    Generator-->>Main: Return generated files
    
    Main->>Output: Validate outputs
    Output->>Output: Check file integrity
    Output->>Output: Validate Hebrew rendering
    Output-->>Main: Confirm success
```

## 🎛️ תרשים מורכבות עיבוד עברית

```mermaid
graph TD
    HebrewText[📝 Hebrew Text Input] --> Reshape[🔄 Arabic Reshaper]
    Reshape --> BiDi[↔️ BiDi Algorithm]
    BiDi --> FontCheck{🔍 Font Support?}
    
    FontCheck -->|❌ No| Fallback[🔄 Use Fallback Font]
    FontCheck -->|✅ Yes| Render[🎨 Render Text]
    
    Fallback --> Render
    Render --> LineBreak[📏 Line Breaking]
    LineBreak --> Alignment[📐 RTL Alignment]
    Alignment --> Output[✅ Rendered Hebrew Text]
    
    subgraph "🚨 Error Handling"
        ReshapeError[Reshape Error]
        FontError[Font Error]
        RenderError[Render Error]
    end
    
    Reshape -.->|Error| ReshapeError
    FontCheck -.->|Error| FontError
    Render -.->|Error| RenderError
```

## 📊 תרשים ניהול מטלות ומפגשים

```mermaid
graph TD
    CourseData[📚 Course Data] --> SessionsArray[📋 Sessions Array]
    CourseData --> AssignmentsArray[📝 Assignments Array]
    
    SessionsArray --> SessionLoop{🔄 For Each Session}
    SessionLoop --> ExtractSession[📤 Extract Session Data]
    ExtractSession --> ProcessObjectives[🎯 Process Objectives]
    ProcessObjectives --> MapDuration[⏱️ Map Duration]
    MapDuration --> SessionLoop
    
    AssignmentsArray --> AssignLoop{🔄 For Each Assignment}
    AssignLoop --> ExtractAssignment[📤 Extract Assignment]
    ExtractAssignment --> ProcessRubric[📊 Process Rubric]
    ProcessRubric --> CalculateWeights[⚖️ Calculate Weights]
    CalculateWeights --> AssignLoop
    
    SessionLoop -->|Complete| IntegratedSessions[✅ Integrated Sessions]
    AssignLoop -->|Complete| IntegratedAssignments[✅ Integrated Assignments]
    
    IntegratedSessions --> UnifiedStructure[🏗️ Unified Course Structure]
    IntegratedAssignments --> UnifiedStructure
```

## 🔧 תרשים טיפול בשגיאות

```mermaid
graph TD
    Process[🔄 Process Step] --> Check{🔍 Check Success?}
    Check -->|✅ Success| NextStep[➡️ Next Step]
    Check -->|❌ Error| LogError[📝 Log Error]
    
    LogError --> ErrorType{🔍 Error Type?}
    
    ErrorType -->|Critical| CriticalError[🚨 Critical Error]
    ErrorType -->|Recoverable| RecoverableError[⚠️ Recoverable Error]
    ErrorType -->|Warning| WarningError[💡 Warning]
    
    CriticalError --> ExitProcess[❌ Exit Process]
    RecoverableError --> Fallback[🔄 Apply Fallback]
    WarningError --> Continue[➡️ Continue with Warning]
    
    Fallback --> NextStep
    Continue --> NextStep
    
    NextStep --> Process
    ExitProcess --> End([🔚 END])
```

## 📈 תרשים מדדי ביצועים

```mermaid
graph LR
    subgraph "⏱️ TIME METRICS"
        LoadTime[JSON Loading < 100ms]
        ProcessTime[Processing < 500ms]
        PDFTime[PDF Gen < 2s]
        PPTXTime[PPTX Gen < 1s]
        TotalTime[Total < 5s]
    end
    
    subgraph "✅ QUALITY METRICS"
        HebrewAccuracy[Hebrew Accuracy > 99%]
        ContentComplete[Content Complete 100%]
        FormatConsist[Format Consistency > 95%]
    end
    
    subgraph "🛡️ RELIABILITY METRICS"
        ErrorHandling[Graceful Error Handling]
        Recovery[Automatic Recovery]
        Logging[100% Logging Coverage]
    end
    
    LoadTime --> ProcessTime
    ProcessTime --> PDFTime
    PDFTime --> PPTXTime
    PPTXTime --> TotalTime
    
    HebrewAccuracy --> ContentComplete
    ContentComplete --> FormatConsist
    
    ErrorHandling --> Recovery
    Recovery --> Logging
```

---

## 🎯 סיכום התרשימים

התרשימים מציגים:

1. **זרימה ראשית** - מקבלת נתונים ועד פלט מוגמר
2. **ארכיטקטורה מפורטת** - שכבות המערכת והקשרים ביניהן  
3. **זרימת נתונים** - רצף פעולות בין רכיבי המערכת
4. **עיבוד עברית** - המורכבות הייחודית של טיפול בטקסט עברי
5. **ניהול תוכן** - איך המערכת מטפלת במפגשים ומטלות
6. **טיפול בשגיאות** - מנגנוני התאוששות ובקרת איכות
7. **מדדי ביצועים** - מעקב אחר יעילות המערכת

המערכת מתוכננת להיות עמידה, יעילה ומדויקת בטיפול בתוכן עברי מורכב.