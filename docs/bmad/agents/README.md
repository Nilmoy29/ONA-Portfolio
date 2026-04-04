# BMAD™ Agents

This directory contains documentation for all BMAD™ AI agents and their roles in the development process.

## 🎯 Agent Overview

BMAD™ employs specialized AI agents, each designed for specific roles in the software development lifecycle. Each agent has:

- **Defined Persona**: Specific behavioral characteristics and focus areas
- **Command Set**: Available commands for interaction
- **Dependencies**: Tasks, templates, and checklists they can access
- **Workflow Integration**: How they fit into development processes

## 👥 Available Agents

### Core Development Agents

| Agent | File | Role | Primary Focus |
|-------|------|------|---------------|
| **Product Owner** | [`po.md`](po.md) | Requirements Management | User stories, acceptance criteria, backlog prioritization |
| **Architect** | [`architect.md`](architect.md) | System Design | Technical architecture, design patterns, system specifications |
| **Developer** | [`dev.md`](dev.md) | Implementation | Code development, refactoring, technical documentation |
| **QA Engineer** | [`qa.md`](qa.md) | Quality Assurance | Testing strategies, quality gates, defect prevention |
| **UX Expert** | [`ux-expert.md`](ux-expert.md) | User Experience | Interface design, user flows, usability testing |

### Specialized Agents

| Agent | File | Role | Primary Focus |
|-------|------|------|---------------|
| **Analyst** | [`analyst.md`](analyst.md) | Business Analysis | Requirements analysis, data modeling, system analysis |
| **Project Manager** | [`pm.md`](pm.md) | Project Coordination | Timeline management, resource allocation, risk assessment |
| **Scrum Master** | [`sm.md`](sm.md) | Process Facilitation | Team dynamics, process optimization, impediment removal |
| **BMAD Master** | [`bmad-master.md`](bmad-master.md) | Methodology Oversight | Process compliance, quality assurance, methodology guidance |
| **BMAD Orchestrator** | [`bmad-orchestrator.md`](bmad-orchestrator.md) | Workflow Coordination | Multi-agent coordination, complex workflow management |

## 🔧 Agent Configuration

Each agent is configured with:

### Core Components
- **Activation Instructions**: How to initialize and use the agent
- **Persona Definition**: Behavioral characteristics and focus areas
- **Command Set**: Available commands and operations
- **Dependencies**: Reference to tasks, templates, and checklists

### Configuration Sources
Agents are defined across multiple locations for different IDE integrations:

- **`.bmad-core/agents/`**: Core agent definitions
- **`.claude/commands/BMad/agents/`**: Claude-specific agent commands
- **`.cursor/rules/bmad/`**: Cursor IDE integration rules

## 📋 Agent Commands

### Common Commands
All agents support these standard commands:

- `*help` - Display available commands
- `*exit` - Exit agent mode
- `*yolo` - Toggle confirmation skipping

### Role-Specific Commands

#### Product Owner (Sarah)
- `*create-epic` - Create epic for brownfield projects
- `*create-story` - Create user story from requirements
- `*execute-checklist-po` - Run PO master checklist
- `*validate-story-draft` - Validate story drafts

#### Architect
- `*design-system` - Design system architecture
- `*review-architecture` - Review technical architecture
- `*create-technical-spec` - Create technical specifications

#### Developer
- `*implement-feature` - Implement specific features
- `*refactor-code` - Code refactoring operations
- `*write-tests` - Generate unit tests

#### QA Engineer
- `*create-test-plan` - Create comprehensive test plans
- `*run-quality-gate` - Execute quality assurance checks
- `*analyze-test-results` - Test result analysis

#### UX Expert
- `*design-interface` - Interface design and prototyping
- `*create-user-flows` - User flow documentation
- `*conduct-usability-review` - Usability testing and review

## 🔄 Agent Workflows

### Standard Development Workflow

1. **Product Owner** → Defines requirements and creates user stories
2. **Analyst** → Analyzes requirements and business logic
3. **Architect** → Designs technical architecture and specifications
4. **UX Expert** → Designs user interfaces and experiences
5. **Developer** → Implements features according to specifications
6. **QA Engineer** → Tests implementation and validates quality
7. **Project Manager** → Coordinates timeline and resources
8. **Scrum Master** → Facilitates process and removes impediments

### Complex Project Workflow

For large or complex projects:

1. **BMAD Orchestrator** → Coordinates multi-agent efforts
2. **BMAD Master** → Ensures methodology compliance
3. **Specialized Agents** → Execute domain-specific tasks
4. **Quality Gates** → Validate work at each stage

## 📚 Agent Documentation

Each agent has comprehensive documentation including:

- **Role Description**: What the agent does and when to use it
- **Capabilities**: Specific skills and expertise areas
- **Command Reference**: Complete list of available commands
- **Workflow Integration**: How the agent fits into development processes
- **Best Practices**: Recommended usage patterns and tips

## 🚀 Getting Started with Agents

### Activation Process

1. **Choose Agent**: Select the appropriate agent for your task
2. **Read Configuration**: Review agent documentation and capabilities
3. **Initialize**: Use the activation command or process
4. **Execute Commands**: Use `*help` to see available operations
5. **Follow Workflows**: Use appropriate workflows for your task type

### Best Practices

- **Right Agent for the Job**: Choose agents based on specific needs
- **Sequential Workflow**: Follow agent workflow sequences
- **Documentation Review**: Always review agent-generated documentation
- **Quality Gates**: Use QA agents for validation checkpoints
- **Process Compliance**: Follow BMAD™ methodology guidelines

## 🔗 Integration Points

### IDE Integration
- **Cursor**: `.cursor/rules/bmad/` agent rules
- **Claude**: `.claude/commands/BMad/agents/` command definitions
- **VSCode**: Extension-based agent integration

### Workflow Integration
- **Task Dependencies**: Agents reference shared tasks and templates
- **Checklist Integration**: Quality assurance checklists
- **Template Usage**: Standardized documentation templates

### Project Integration
- **Core Configuration**: `.bmad-core/core-config.yaml`
- **Project Structure**: Integration with project file structure
- **Documentation Flow**: Automated documentation generation

## 📊 Agent Metrics

Track agent performance and effectiveness:

- **Task Completion Rate**: Successfully completed tasks
- **Quality Score**: Documentation and code quality metrics
- **Process Adherence**: Compliance with methodology guidelines
- **User Satisfaction**: Stakeholder feedback on agent outputs

## 🛠️ Customization

Agents can be customized through:

- **Persona Modification**: Adjust behavioral characteristics
- **Command Extension**: Add project-specific commands
- **Template Customization**: Modify or extend templates
- **Workflow Adaptation**: Adjust workflows for specific needs

## 📞 Support

For agent-related questions:

- Review specific agent documentation
- Check workflow guides in `../workflows/`
- Use checklists from `../checklists/`
- Refer to core configuration in `.bmad-core/core-config.yaml`

---

**Navigate to specific agent documentation using the links above.**