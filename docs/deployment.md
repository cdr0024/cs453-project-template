```mermaid
flowchart LR

Browser --> API
API --> Database

subgraph Docker
API
Database
end
```