# **ONA Portfolio Website \- Project Overview**

## **🏛️ Project Introduction**

The **Office of Native Architects (ONA)** portfolio website is a high-end, visually immersive digital platform designed to showcase architectural works, design philosophy, and creative explorations. This modern architectural practice website embodies ONA's core principles of **effectuality**, **integrity**, **efficiency**, and **coexistence**.

The website serves as a comprehensive digital presence that rivals top architecture firms like BIG, Foster \+ Partners, and SOM, providing an interactive experience that reflects the firm's design sensibilities and professional excellence.

## **🎯 Project Objectives**

### **Primary Goals**

* **Portfolio Showcase**: Display architectural projects with rich media and detailed case studies  
* **Brand Identity Hub**: Establish ONA's digital presence and design philosophy  
* **Client Acquisition**: Prove capabilities through past work and partner recognition  
* **Creative Platform**: Share visual research, artwork, and photography  
* **Professional Network**: Showcase team expertise and partnerships

### **Target Audience**

* **Prospective Clients**: Seeking architectural services  
* **Industry Professionals**: Architects, designers, and collaborators  
* **Media & Press**: Architecture publications and journalists  
* **Academia**: Students and researchers in architecture  
* **General Public**: Architecture enthusiasts and community members

## **🌐 Website Structure & Key Sections**

### **1\. Hero & Introduction Section**

* **Purpose**: To immediately capture visitor attention and convey ONA's core philosophy.  
* **Elements**:  
  * **Dynamic Visuals**: High-quality, immersive imagery or video showcasing architectural concepts.  
  * **Catchy Tagline**: A concise statement reflecting ONA's vision.  
  * **Core Principles Display**: Prominent presentation of "Effectuality | Integrity | Efficiency | Coexistence" as foundational values.  
  * **Call to Action**: Subtle prompts to explore the portfolio or learn more.

### **2\. Navigation Bar (Header)**

* **Purpose**: To provide intuitive and clear navigation throughout the site.  
* **Elements**:  
  * **Logo**: Prominent ONA logo, linking to the homepage.  
  * **Main Navigation Links**:  
    * Services  
    * Projects  
    * Team  
    * ONA Explore  
    * Contact  
  * **3-Dot Menu (Hamburger Menu)**: For mobile responsiveness and additional utility links (e.g., language selection, privacy policy, sitemap).

### **3\. BODY Sections**

#### **a. Services Section**

* **Purpose**: To detail the range of architectural and design services offered by ONA.  
* **Elements**:  
  * **"Our Services" Headline**: Clear and concise introduction.  
  * **Service Categories**: Each service listed with a brief description and potential for a dedicated sub-page for more details.  
    * Architectural Design  
    * Interior Solution  
    * Landscaping and Rooftop Garden  
    * Lighting Solution  
    * Old Building and Heritage Renovation  
    * Environmental Simulation and Feasibility Analysis  
    * Regional Planning  
    * Mural and Graffiti  
    * Project Management and Execution

#### **b. Project Showcase**

* **Purpose**: To present ONA's completed and proposed architectural projects.  
* **Elements**:  
  * **"Projects" Headline**: Clear section title.  
  * **Category Segment/Filters**: Interactive filtering options for project categories:  
    * All Projects  
    * Residence  
    * Commercial  
    * Religious  
    * Proposed  
    * Interior  
  * **Sorting**: Option to sort projects from "Latest to Old" (or vice-versa).  
  * **Project Cards/Thumbnails**: Visually appealing grid or carousel of projects, each with a title, category, and captivating image.  
  * **Detailed Project Pages**: Clicking a project card leads to a dedicated page with:  
    * Rich media (high-resolution images, videos, 3D renders)  
    * Detailed case studies, design philosophy, and challenges addressed  
    * Floor plans, elevations, and technical drawings (where appropriate)  
    * Client testimonials or project impact statements.  
  * **Reference Folder**: (Internal Note: Link to Google Drive folder for assets: https://drive.google.com/drive/folders/1OK9X-GHlZHGhpQ1OQeuc3YTDiXkvVDgS?usp=drive\_link)

#### **c. Team Section**

* **Purpose**: To introduce the talented individuals behind ONA and highlight their expertise.  
* **Elements**:  
  * **"Team" Headline**: Engaging section title.  
  * **Individual Profile Cards**: Grid layout of team members with:  
    * Professional photos  
    * Names  
    * Roles/Titles  
  * **Clickable Profiles**: Each card is clickable, leading to a sub-page or modal with:  
    * Detailed biography  
    * Academic and work background  
    * Key achievements and contributions to ONA projects  
    * Specializations and areas of expertise.

#### **d. ONA Explore**

* **Purpose**: To showcase ONA's broader creative and intellectual pursuits beyond client projects.  
* **Elements**:  
  * **Content Categories**:  
    * Visual Articles (in-depth essays, thought leadership)  
    * Artwork Showcase (original creative works by team members)  
    * Research (academic papers, design research, material studies)  
    * Photography (architectural photography, artistic explorations)  
  * **Layout**: Tabs or gallery layout for easy navigation between content types.  
  * **Interactive Experience**: Scroll-triggered animations and subtle transitions for an immersive reading/browsing experience.

#### **e. Partners/Allies Section**

* **Purpose**: To highlight collaborations and build trust through social proof.  
* **Elements**:  
  * **"Partners" or "Allies" Headline**: Clear section title.  
  * **Company Logos Grid**: A visually appealing grid of logos of past clients, collaborators, and industry partners.  
  * **Testimonials (Optional)**: Short quotes from key partners.

### **4\. Footer**

* **Purpose**: To provide essential information, navigation, and contact points.  
* **Elements**:  
  * **Social Media Links**: Icons linking to ONA's profiles on platforms like LinkedIn, Instagram, etc.  
  * **Contact Details**: Office address, phone number, and email address.  
  * **Newsletter or Inquiry Form**: A concise form for visitors to subscribe to updates or send quick inquiries.  
  * **SEO Metadata and Links**:  
    * Copyright information.  
    * Privacy Policy and Terms of Service links.  
    * Sitemap link.  
    * Relevant keywords for search engine optimization.

## **Refrence website**

main : https://wpdemo.archiwp.com/theratio/home-7/  
BIG | Bjarke Ingels Group \- Interactive loading page and logo  
Context BD • Home \- spotlight section  
Foster \+ Partners \- Interface  
https://latelier2.archi/ \- interface  
Homepage – SOM

## **🛠️ Technology Stack**

### **Frontend**

* **Framework**: Next.js 13+ (React-based)  
* **Styling**: TailwindCSS for utility-first styling  
* **Animation**: Framer Motion for sophisticated interactions  
* **Language**: TypeScript for type safety  
* **Image Optimization**: Next.js Image component with Supabase Storage

### **Backend**

* **Database**: Supabase (PostgreSQL)  
* **Authentication**: Supabase Auth with JWT  
* **Storage**: Supabase Storage for media files  
* **API**: Supabase Auto-generated REST API  
* **Real-time**: Supabase Realtime subscriptions

### **Development & Deployment**

* **Version Control**: Git with GitHub  
* **Package Manager**: npm/yarn  
* **Deployment**: Vercel (recommended for Next.js)  
* **CDN**: Vercel Edge Network  
* **Environment**: Node.js 20+

## **🏗️ System Architecture**

### **Headless CMS Architecture**

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  
│   Frontend      │    │   Supabase      │    │   Admin Panel   │  
│   (Next.js)     │◄──►│   Backend       │◄──►│   (Protected)   │  
│                 │    │                 │    │                 │  
│ • Public Pages  │    │ • PostgreSQL    │    │ • Content CRUD  │  
│ • Animations    │    │ • Auth System   │    │ • Media Upload  │  
│ • Responsive    │    │ • File Storage  │    │ • User Management│  
│ • SEO Ready     │    │ • Row-Level     │    │ • Analytics     │  
└─────────────────┘    │   Security      │    └─────────────────┘  
                       └─────────────────┘

### **Data Flow**

1. **Content Creation**: Admins create/edit content through protected admin panel  
2. **Database Storage**: Content stored in Supabase with proper relationships  
3. **API Consumption**: Frontend fetches data via Supabase client  
4. **Static Generation**: Next.js generates optimized pages at build time  
5. **Dynamic Updates**: Real-time updates for admin changes

## **📱 Key Features & Functionality**

### **🎨 Frontend Features**

#### **Homepage**

* **Hero Section**: Animated intro with company tagline  
* **Featured Projects**: Spotlight on selected architectural works  
* **Services Overview**: Brief introduction to ONA's capabilities  
* **Recent Updates**: Latest projects and explore content

#### **Project Showcase**

* **Category Filtering**: Filter by residential, commercial, cultural, etc.  
* **Advanced Search**: Full-text search across project content  
* **Grid/List Views**: Multiple viewing options  
* **Project Details**: Comprehensive project pages with galleries  
* **Related Projects**: Intelligent project recommendations

#### **Team Section**

* **Team Grid**: Professional headshots and roles  
* **Individual Profiles**: Detailed bio pages for each team member  
* **Expertise Areas**: Specializations and experience  
* **Contact Information**: Direct contact for team members

#### **ONA Explore**

* **Visual Articles**: In-depth articles with rich media  
* **Artwork Gallery**: Original creative works  
* **Photography**: Architectural and artistic photography  
* **Research Publications**: Academic and industry research  
* **Tabbed Interface**: Smooth navigation between content types

#### **Contact & Information**

* **Contact Form**: Multi-step form with validation  
* **Office Information**: Address, phone, email  
* **Social Links**: LinkedIn, Instagram, Twitter  
* **Newsletter Signup**: Stay updated with latest news

### **🔧 Backend Features**

#### **Content Management**

* **Project Management**: CRUD operations for architectural projects  
* **Team Management**: Team member profiles and bios  
* **Explore Content**: Articles, artwork, photography, research  
* **Partner Management**: Client and collaborator information  
* **Category System**: Flexible tagging and categorization

#### **Admin Dashboard**

* **Authentication**: Secure login with role-based access  
* **Content Editor**: Rich text editing for articles and descriptions  
* **Media Management**: Image upload and gallery management  
* **Analytics**: Basic usage statistics and contact form submissions  
* **Settings**: Site configuration and customization

#### **API Features**

* **REST API**: Auto-generated endpoints for all content  
* **Real-time Updates**: Live content updates for admin users  
* **Search API**: Full-text search across all content  
* **File Upload**: Secure media upload and processing  
* **Email Integration**: Contact form email notifications

### **🎭 Animation & Interactions**

#### **Scroll Animations**

* **Fade In/Out**: Smooth content reveals on scroll  
* **Parallax Effects**: Subtle background movement  
* **Staggered Animations**: Sequential element animations  
* **Progress Indicators**: Visual scroll progress

#### **Hover Effects**

* **Image Overlays**: Project information on hover  
* **Button Animations**: Smooth state transitions  
* **Card Interactions**: Elevation and shadow effects  
* **Icon Animations**: Micro-interactions for better UX

#### **Page Transitions**

* **Route Animations**: Smooth page transitions  
* **Loading States**: Skeleton screens and spinners  
* **Modal Animations**: Smooth popup appearances  
* **Mobile Gestures**: Touch-friendly interactions

## **📊 Database Schema Overview**

### **Core Tables**

* **projects**: Architectural projects with media and details  
* **team\_members**: Team profiles with professional information  
* **explore\_content**: Articles, artwork, photography, research  
* **partners**: Clients and collaborators  
* **categories**: Content organization and filtering  
* **services**: Service offerings and descriptions

### **Relationship Tables**

* **project\_partners**: Many-to-many project-partner relationships  
* **project\_team\_members**: Team member assignments to projects

### **Admin Tables**

* **admin\_profiles**: User roles and permissions  
* **contact\_submissions**: Form submissions and inquiries  
* **admin\_activity\_logs**: Audit trail for admin actions  
* **site\_settings**: Configurable site-wide settings

### **Key Features**

* **Row-Level Security**: Proper access control for public/admin content  
* **Full-Text Search**: Optimized search across all content  
* **Audit Trails**: Complete activity logging  
* **Flexible Media**: JSON arrays for image galleries  
* **SEO Optimization**: Meta fields for all content types

## **🚀 Development Roadmap**

### **Phase 1: Foundation (Weeks 1-2)**

* ✅ Database schema design and setup  
* ✅ Basic Next.js project structure  
* ✅ Supabase integration and configuration  
* ✅ Authentication system implementation  
* ✅ Basic admin dashboard setup

### **Phase 2: Core Features (Weeks 3-4)**

* 🔄 Project showcase with filtering and search  
* 🔄 Team member profiles and detail pages  
* 🔄 Basic content management system  
* 🔄 Responsive design implementation  
* 🔄 Image optimization and lazy loading

### **Phase 3: Advanced Features (Weeks 5-6)**

* 📋 ONA Explore section with tabbed interface  
* 📋 Advanced animations with Framer Motion  
* 📋 Contact form with validation  
* 📋 SEO optimization and meta tags  
* 📋 Performance optimization

### **Phase 4: Polish & Launch (Weeks 7-8)**

* 📋 Testing and bug fixes  
* 📋 Content population and review  
* 📋 Performance auditing  
* 📋 Deployment and DNS configuration  
* 📋 Analytics and monitoring setup

## **🔒 Security Considerations**

### **Authentication & Authorization**

* **JWT-based Auth**: Secure token-based authentication  
* **Role-based Access**: Admin, editor, and viewer roles  
* **Session Management**: Secure session handling  
* **Password Policies**: Strong password requirements

### **Data Protection**

* **Row-Level Security**: Database-level access control  
* **Input Validation**: Sanitization of all user inputs  
* **SQL Injection Prevention**: Parameterized queries  
* **XSS Protection**: Content sanitization

### **Infrastructure Security**

* **HTTPS Enforcement**: SSL/TLS for all communications  
* **Environment Variables**: Secure configuration management  
* **Rate Limiting**: API abuse prevention  
* **Backup Strategy**: Regular database backups

## **🎨 Design Principles**

### **Visual Design**

* **Minimalist Aesthetic**: Clean, uncluttered interfaces  
* **Typography**: Professional, readable font choices  
* **Color Palette**: Sophisticated, architecture-inspired colors  
* **White Space**: Generous spacing for visual breathing room  
* **Grid System**: Consistent layout and alignment

### **User Experience**

* **Intuitive Navigation**: Clear information architecture  
* **Fast Loading**: Optimized performance and caching  
* **Accessibility**: WCAG compliance and screen reader support  
* **Mobile First**: Responsive design for all devices  
* **Progressive Enhancement**: Works without JavaScript

### **Performance**

* **Image Optimization**: WebP format and lazy loading  
* **Code Splitting**: Efficient JavaScript bundling  
* **Caching Strategy**: Static generation and CDN caching  
* **Database Optimization**: Indexed queries and efficient relations  
* **Monitoring**: Performance tracking and alerting

## **📈 Success Metrics**

### **Technical Metrics**

* **Page Load Speed**: \< 3 seconds for first contentful paint  
* **SEO Score**: 90+ Lighthouse SEO score  
* **Accessibility**: WCAG 2.1 AA compliance  
* **Mobile Performance**: 90+ mobile Lighthouse score  
* **Uptime**: 99.9% availability

### **Business Metrics**

* **Contact Form Submissions**: Track inquiry quality and quantity  
* **Project Page Views**: Measure portfolio engagement  
* **Time on Site**: User engagement depth  
* **Return Visitors**: Brand recognition and loyalty  
* **Search Rankings**: Organic visibility for key terms

## **🤝 Contributing Guidelines**

### **Development Setup**

1. Clone the repository  
2. Install dependencies: npm install  
3. Set up environment variables  
4. Run database migrations  
5. Start development server: npm run dev

### **Code Standards**

* **TypeScript**: Use strict type checking  
* **ESLint**: Follow configured linting rules  
* **Prettier**: Consistent code formatting  
* **Commit Messages**: Use conventional commit format  
* **Testing**: Write unit and integration tests

### **Pull Request Process**

1. Create feature branch from main  
2. Implement changes with proper testing  
3. Update documentation if needed  
4. Submit PR with detailed description  
5. Address review feedback  
6. Merge after approval

## **📞 Support & Maintenance**

### **Documentation**

* **API Documentation**: Complete endpoint documentation  
* **User Guide**: Admin panel usage instructions  
* **Technical Guide**: Development and deployment guide  
* **Troubleshooting**: Common issues and solutions

### **Maintenance Plan**

* **Regular Updates**: Monthly dependency updates  
* **Security Patches**: Immediate security vulnerability fixes  
* **Performance Monitoring**: Continuous performance tracking  
* **Backup Verification**: Monthly backup integrity checks  
* **Content Reviews**: Quarterly content audits

Project Status: 🚧 In Development  
Last Updated: July 2025  
Next Review: August 2025  
For questions or support, please contact the development team or refer to the project documentation.