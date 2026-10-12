import { useEffect, useState } from "react";

import { apiRequest } from "./api";
import ShieldBot from "./components/ShieldBot";
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  Globe,
  LayoutDashboard,
  ArrowRight,
  Menu,
  X,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  ScanSearch,
  Smartphone,
  BadgeCheck,
  Activity,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Fingerprint,
  Radar,
  Layers3,
  Save,
} from "lucide-react";
import "./index.css";

const initialThreats = [
  {
    id: 1,
    asset: "digishield_support_help",
    platform: "Social platform",
    type: "Possible impersonation",
    risk: "High",
    status: "Needs review",
    date: "Today, 10:42 AM",
  },
  {
    id: 2,
    asset: "digishieId-security.com",
    platform: "Website / Domain",
    type: "Look-alike name",
    risk: "High",
    status: "Needs review",
    date: "Today, 09:18 AM",
  },
  {
    id: 3,
    asset: "DigiShield Rewards",
    platform: "Mobile app",
    type: "Unverified brand usage",
    risk: "Medium",
    status: "Investigating",
    date: "Yesterday",
  },
  {
    id: 4,
    asset: "digishield_official_team",
    platform: "Social platform",
    type: "Suspicious profile",
    risk: "Medium",
    status: "Investigating",
    date: "Yesterday",
  },
];

const features = [
  {
    icon: Fingerprint,
    number: "01",
    title: "Brand impersonation",
    description:
      "Identify suspicious accounts and pages pretending to represent your brand.",
  },
  {
    icon: Smartphone,
    number: "02",
    title: "Fake app detection",
    description:
      "Review suspicious mobile applications that may misuse your brand identity.",
  },
  {
    icon: Globe,
    number: "03",
    title: "Look-alike detection",
    description:
      "Spot names that imitate your official brand through altered spelling.",
  },
];

function BrandMark({ small = false }) {
  return (
    <span className={`brand-mark ${small ? "brand-mark-small" : ""}`}>
      <ShieldCheck size={small ? 19 : 24} />
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="section-label">
      <span />
      {children}
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [activePage, setActivePage] = useState("Overview");
  const [userName, setUserName] = useState("Demo User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [threats, setThreats] = useState(initialThreats);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanCount, setScanCount] = useState(1);
  const [scanMessage, setScanMessage] = useState("");
  
const [aiAnalysis, setAiAnalysis] = useState({});
const [aiLoadingId, setAiLoadingId] = useState(null);

  // Brand profile information
  const [brandName, setBrandName] = useState("DigiShield");
  const [brandWebsite, setBrandWebsite] = useState(
    "https://digishield.example"
  );
  const [officialAccounts, setOfficialAccounts] = useState(
    "digishield_official"
  );
  const [officialApps, setOfficialApps] = useState(
    "DigiShield Security"
  );
  const [savedBrand, setSavedBrand] = useState(false);

  // Personal profile information
  const [profileName, setProfileName] = useState("Demo User");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setAuthError("");
    setScreen("auth");
    setMobileNavOpen(false);
  };

  const goLanding = () => {
    setScreen("landing");
    setActivePage("Overview");
    setMobileNavOpen(false);
    setScanMessage("");
  };

  
const handleAuth = async (event) => {
  event.preventDefault();
  setAuthError("");
  setLoading(true);

  if (!email.trim() || !password.trim()) {
    setAuthError("Please enter your email and password.");
    setLoading(false);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    setAuthError("Please enter a valid email address.");
    setLoading(false);
    return;
  }

  if (authMode === "signup" && password.length < 8) {
    setAuthError("Password must contain at least 8 characters.");
    setLoading(false);
    return;
  }

  if (authMode === "signup" && !fullName.trim()) {
    setAuthError("Please enter your full name.");
    setLoading(false);
    return;
  }

  try {
    if (authMode === "signup") {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });
    }

    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    if (!data.access_token) {
      throw new Error("Server did not return an access token.");
    }

    localStorage.setItem("access_token", data.access_token);

    const name =
      data.name ||
      (authMode === "signup"
        ? fullName.trim()
        : email.split("@")[0].replace(/[._-]/g, " "));

    setUserName(name);
    setProfileName(name);
    setProfileEmail(email.trim());
    setScreen("dashboard");
    setActivePage("Overview");
    setPassword("");
    setScanMessage("");
    setProfileMessage("");
  } catch (error) {
    setAuthError(error.message || "Authentication failed.");
  } finally {
    setLoading(false);
  }
};

const logout = () => {
  localStorage.removeItem("access_token");

  setScreen("landing");
  setEmail("");
  setPassword("");
  setFullName("");
  setAuthError("");
  setActivePage("Overview");
  setMobileNavOpen(false);
  setScanMessage("");
  setProfileMessage("");
  setDashboardSummary(null);
  setBrandId(null);
  setThreats([]);
};

const loadDashboardData = async () => {
  try {
    const [summary, brands, findings] = await Promise.all([
      apiRequest("/dashboard/summary"),
      apiRequest("/brands"),
      apiRequest("/findings"),
    ]);

    setDashboardSummary(summary);

    const brandList = Array.isArray(brands)
      ? brands
      : brands.brands || [];

    if (brandList.length > 0) {
      const brand = brandList[0];

      setBrandId(brand._id || brand.id);
      setBrandName(brand.official_name || "");
      setBrandWebsite(brand.website || "");
      setOfficialAccounts(
        (brand.official_social_urls || []).join("\n")
      );
      setOfficialApps(
        (brand.official_app_identifiers || []).join("\n")
      );
      setSavedBrand(true);
    }

    const findingList = Array.isArray(findings)
      ? findings
      : findings.findings || [];

    setThreats(
      findingList.map((item) => ({
        id: item._id || item.id || item.finding_id,
        asset:
          item.detected_name ||
          item.app_name ||
          item.profile_url ||
          "Unknown asset",
        platform: item.platform || item.scan_type || "Unknown",
        type: item.reason || item.finding_type || "Potential risk",
        risk:
          Number(item.risk_score || 0) >= 70
            ? "High"
            : Number(item.risk_score || 0) >= 40
              ? "Medium"
              : "Low",
        riskScore: item.risk_score || 0,
        status: item.status || "Under Review",
        date: item.created_at || "",
      }))
    );
  } catch (error) {
    setScanMessage(`Could not load backend data: ${error.message}`);
  }
};

useEffect(() => {
  if (screen === "dashboard") {
    loadDashboardData();
  }
}, [screen]);


  const navigateDashboard = (page) => {
    setActivePage(page);
    setMobileNavOpen(false);
    setScanMessage("");
    setProfileMessage("");
  };

  const openProfile = () => {
    setProfileName(userName);
    setProfileEmail(email);
    navigateDashboard("Profile");
  };

  const runDemoScan = async () => {
  if (!brandId) {
    setScanMessage("Please save your brand profile before scanning.");
    setActivePage("Brand Profile");
    return;
  }

  setLoading(true);
  setScanMessage("Running social and app demo analysis...");

  try {
    const payload = { brand_id: brandId };

    const [socialResult, appResult] = await Promise.all([
      apiRequest("/scans/social/demo", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
      apiRequest("/scans/apps/demo", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    ]);

    setScanCount((count) => count + 2);
    await loadDashboardData();

    setScanMessage(
      `Demo analysis complete: ${(socialResult.findings || []).length} social and ${(appResult.findings || []).length} app findings saved for review. Fictional candidates only; live monitoring is not connected.`
    );
    setActivePage("Monitoring");
  } catch (error) {
    setScanMessage(`Demo scan failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


const analyzeFindingWithAI = async (id) => {
  try {
    setAiLoadingId(id);
    setAiAnalysis((current) => ({
      ...current,
      [id]: "",
    }));

    const result = await apiRequest(
      `/findings/${id}/ai-analysis`,
      { method: "POST" }
    );

    setAiAnalysis((current) => ({
      ...current,
      [id]: result.analysis || "No analysis returned.",
    }));
  } catch (error) {
    setAiAnalysis((current) => ({
      ...current,
      [id]: `Analysis failed: ${error.message}`,
    }));
  } finally {
    setAiLoadingId(null);
  }
};

 
const updateThreatStatus = async (id, status) => {
  try {
    await apiRequest(`/findings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    setThreats((current) =>
      current.map((threat) =>
        threat.id === id ? { ...threat, status } : threat
      )
    );

    setScanMessage("Finding status updated successfully.");

    const summary = await apiRequest("/dashboard/summary");
    setDashboardSummary(summary);
  } catch (error) {
    setScanMessage(`Status update failed: ${error.message}`);
  }
};


  const saveProfile = (event) => {
    event.preventDefault();

    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileMessage("Please enter your name and email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileEmail)) {
      setProfileMessage("Please enter a valid email address.");
      return;
    }

    setUserName(profileName.trim());
    setEmail(profileEmail.trim());
    setProfileMessage("Profile updated successfully.");
  };

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch = [
      threat.asset,
      threat.platform,
      threat.type,
      threat.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRisk =
      riskFilter === "All" || threat.risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Brand Profile", icon: BadgeCheck },
    { label: "Monitoring", icon: ScanSearch },
    { label: "Results & Review", icon: ShieldAlert },
  ];

  if (screen === "dashboard") {
    return (
      <div className="dashboard-shell">
        {mobileNavOpen && (
          <button
            className="mobile-overlay"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        <aside
          className={`dashboard-sidebar ${
            mobileNavOpen ? "sidebar-open" : ""
          }`}
        >
          <button className="dashboard-brand" onClick={goLanding}>
            <BrandMark />
            <span>
              <strong>DigiShield</strong>
              <small>Digital Risk Protection</small>
            </span>
          </button>

          <div className="sidebar-workspace">
            <span className="workspace-avatar">D</span>
            <span>
              <strong>Demo Workspace</strong>
              <small>Brand protection</small>
            </span>
            <ChevronRight size={16} />
          </div>

          <p className="sidebar-heading">WORKSPACE</p>

          <nav className="dashboard-nav" aria-label="Dashboard navigation">
            {navigation.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={`nav-item ${
                  activePage === label ? "nav-item-active" : ""
                }`}
                onClick={() => navigateDashboard(label)}
              >
                <Icon size={18} />
                <span>{label}</span>
                {label === "Results & Review" && (
                  <span className="nav-count">{threats.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-status">
              <span className="status-dot" />
              <div>
                <strong>Demo environment</strong>
                <small>Live sources disconnected</small>
              </div>
            </div>

            <button
              className={`nav-item ${
                activePage === "Settings" ? "nav-item-active" : ""
              }`}
              onClick={() => navigateDashboard("Settings")}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>

            <button className="nav-item logout-item" onClick={logout}>
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-topbar">
            <button
              className="icon-button mobile-menu-button"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div className="breadcrumb">
              Workspace <ChevronRight size={15} />
              <strong>{activePage}</strong>
            </div>

            <div className="topbar-actions">
              <span className="demo-pill">
                <span /> DEMO MODE
              </span>

              <button
                className="icon-button"
                aria-label="Notifications"
                title="Notifications"
                onClick={() =>
                  setScanMessage(
                    "You have no new notifications in this demo."
                  )
                }
              >
                <Bell size={19} />
              </button>

              <button
                type="button"
                className="user-avatar profile-avatar-button"
                onClick={openProfile}
                title="My Profile"
                aria-label="Open My Profile"
              >
                {(userName.trim()[0] || "U").toUpperCase()}
              </button>
            </div>
          </header>

          <div className="dashboard-content">
            {scanMessage && (
              <div className="notice-banner">
                <CheckCircle2 size={18} />
                <span>{scanMessage}</span>
                <button
                  onClick={() => setScanMessage("")}
                  aria-label="Dismiss message"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {/* OVERVIEW */}
            {activePage === "Overview" && (
              <>
                <div className="dashboard-welcome">
                  <div>
                    <SectionLabel>SECURITY OVERVIEW</SectionLabel>
                    <h1>
                      Good to see you, {userName.split(" ")[0]}.
                    </h1>
                    <p>
                      Monitor your digital presence and review potential
                      brand risks from one workspace.
                    </p>
                  </div>

                  <button className="primary-button" onClick={runDemoScan}>
                    <ScanSearch size={17} />
                    Run demo scan
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="demo-notice">
                  <AlertTriangle size={17} />
                  <span>
                    Demo data only. Live platform monitoring is not connected.
                  </span>
                </div>

                <div className="metric-grid">
                  <div className="metric-card">
                    <div className="metric-top">
                      <span>Potential threats</span>
                      <span className="metric-icon red-icon">
                        <ShieldAlert size={19} />
                      </span>
                    </div>
                    <strong>{threats.length}</strong>
                    <small className="metric-detail">
                      Sample threat records
                    </small>
                  </div>

                  <div className="metric-card">
                    <div className="metric-top">
                      <span>High-risk alerts</span>
                      <span className="metric-icon red-icon">
                        <AlertTriangle size={19} />
                      </span>
                    </div>
                    <strong>
                      {threats.filter((item) => item.risk === "High").length}
                    </strong>
                    <small className="metric-detail">
                      Require closer review
                    </small>
                  </div>

                  <div className="metric-card">
                    <div className="metric-top">
                      <span>Assets monitored</span>
                      <span className="metric-icon">
                        <Globe size={19} />
                      </span>
                    </div>
                    <strong>08</strong>
                    <small className="metric-detail">
                      Example brand assets
                    </small>
                  </div>

                  <div className="metric-card">
                    <div className="metric-top">
                      <span>Demo scans</span>
                      <span className="metric-icon">
                        <Activity size={19} />
                      </span>
                    </div>
                    <strong>{scanCount}</strong>
                    <small className="metric-detail">This session</small>
                  </div>
                </div>

                <div className="dashboard-two-column">
                  <section className="panel threat-panel">
                    <div className="panel-header">
                      <div>
                        <h2>Recent threat activity</h2>
                        <p>Example findings requiring attention</p>
                      </div>
                      <button
                        className="text-button"
                        onClick={() =>
                          navigateDashboard("Results & Review")
                        }
                      >
                        View all <ArrowRight size={15} />
                      </button>
                    </div>

                    <div className="threat-list">
                      {threats.slice(0, 3).map((threat) => (
                        <div className="threat-row" key={threat.id}>
                          <div className="threat-symbol">
                            <AlertTriangle size={18} />
                          </div>
                          <div className="threat-description">
                            <strong>{threat.asset}</strong>
                            <small>
                              {threat.type} · {threat.platform}
                            </small>
                          </div>
                          <span
                            className={`risk-label risk-${threat.risk.toLowerCase()}`}
                          >
                            {threat.risk}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="panel protection-panel">
                    <div className="panel-header">
                      <div>
                        <h2>Protection status</h2>
                        <p>Your demo workspace</p>
                      </div>
                      <ShieldCheck size={22} className="panel-red-icon" />
                    </div>

                    <div className="protection-score">
                      <div className="score-ring">
                        <span>
                          <strong>Demo</strong>
                          <small>STATUS</small>
                        </span>
                      </div>
                      <div>
                        <strong>Workspace ready</strong>
                        <p>Configure your brand assets to get started.</p>
                      </div>
                    </div>

                    <div className="setup-progress">
                      <div>
                        <span>Brand profile setup</span>
                        <strong>{savedBrand ? "2 of 3" : "1 of 3"}</strong>
                      </div>
                      <div className="progress-track">
                        <span
                          style={{ width: savedBrand ? "66%" : "33%" }}
                        />
                      </div>
                    </div>

                    <button
                      className="secondary-button full-width"
                      onClick={() => navigateDashboard("Brand Profile")}
                    >
                      Complete brand profile <ArrowRight size={16} />
                    </button>
                  </section>
                </div>

                <section className="panel quick-actions-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Quick actions</h2>
                      <p>Move directly to a protection workflow</p>
                    </div>
                  </div>

                  <div className="quick-action-grid">
                    <button
                      onClick={() => navigateDashboard("Brand Profile")}
                    >
                      <span className="quick-action-icon">
                        <BadgeCheck size={21} />
                      </span>
                      <span>
                        <strong>Set up your brand</strong>
                        <small>Register official brand details</small>
                      </span>
                      <ArrowRight size={17} />
                    </button>

                    <button
                      onClick={() => navigateDashboard("Monitoring")}
                    >
                      <span className="quick-action-icon">
                        <ScanSearch size={21} />
                      </span>
                      <span>
                        <strong>Review monitoring</strong>
                        <small>Explore the demo scan workflow</small>
                      </span>
                      <ArrowRight size={17} />
                    </button>

                    <button
                      onClick={() =>
                        navigateDashboard("Results & Review")
                      }
                    >
                      <span className="quick-action-icon">
                        <Layers3 size={21} />
                      </span>
                      <span>
                        <strong>Investigate findings</strong>
                        <small>Review example threats and risk</small>
                      </span>
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </section>
              </>
            )}

            {/* ATTRACTIVE BRAND PROFILE */}
            {activePage === "Brand Profile" && (
              <section className="page-section brand-profile-page">
                <div className="brand-profile-header">
                  <div>
                    <SectionLabel>BRAND SECURITY CENTER</SectionLabel>
                    <h1>Brand Profile</h1>
                    <p className="page-lead">
                      Manage your brand identity and official digital assets
                      from one secure workspace.
                    </p>
                  </div>

                  <div className="brand-header-status">
                    <span className="status-dot" />
                    <span>Protection workspace</span>
                    <span className="brand-status-label">DEMO</span>
                  </div>
                </div>

                <div className="brand-profile-hero">
                  <div className="brand-identity">
                    <div className="brand-logo-preview">
                      <Fingerprint size={36} />
                    </div>

                    <div className="brand-identity-text">
                      <span className="brand-small-label">
                        YOUR PROTECTED BRAND
                      </span>
                      <h2>{brandName || "Your Brand Name"}</h2>
                      <p>
                        {brandWebsite || "Add your official website"}
                      </p>
                      <span className="brand-protection-badge">
                        <ShieldCheck size={14} />
                        Brand workspace created
                      </span>
                    </div>
                  </div>

                  <div className="brand-hero-divider" />

                  <div className="brand-hero-metric">
                    <span className="brand-metric-icon">
                      <Globe size={20} />
                    </span>
                    <span>Official website</span>
                    <strong>
                      {brandWebsite.trim() ? "Added" : "Not added"}
                    </strong>
                  </div>

                  <div className="brand-hero-metric">
                    <span className="brand-metric-icon">
                      <Activity size={20} />
                    </span>
                    <span>Protection mode</span>
                    <strong>Demo mode</strong>
                  </div>
                </div>

               
<form
  className="panel brand-form brand-profile-form"
  onSubmit={async (event) => {
    event.preventDefault();
    setScanMessage("");
    setLoading(true);

    try {
      const payload = {
        official_name: brandName.trim(),
        website: brandWebsite.trim(),
        logo_url: "",
        official_social_urls: officialAccounts
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        official_app_identifiers: officialApps
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        official_developer: "",
      };

      const saved = await apiRequest("/brands", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setBrandId(saved._id || saved.id || null);
      setSavedBrand(true);
      setScanMessage("Brand profile saved to the backend.");

      await loadDashboardData();
    } catch (error) {
      setScanMessage(`Brand save failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }}
>

                  <div className="brand-section-heading">
                    <div>
                      <span className="brand-section-kicker">
                        01 / IDENTITY
                      </span>
                      <h2>Brand information</h2>
                      <p>
                        Tell DigiShield which brand and website to protect.
                      </p>
                    </div>
                    <span className="brand-section-icon">
                      <Fingerprint size={23} />
                    </span>
                  </div>

                  <div className="brand-form-grid">
                    <label className="brand-field">
                      <span>
                        Brand or company name <b>*</b>
                      </span>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(event) => {
                          setBrandName(event.target.value);
                          setSavedBrand(false);
                        }}
                        placeholder="e.g. Kampus.VC"
                        required
                      />
                      <small>
                        The official name customers recognize.
                      </small>
                    </label>

                    <label className="brand-field">
                      <span>
                        Official website <b>*</b>
                      </span>
                      <input
                        type="url"
                        value={brandWebsite}
                        onChange={(event) => {
                          setBrandWebsite(event.target.value);
                          setSavedBrand(false);
                        }}
                        placeholder="https://yourbrand.com"
                        required
                      />
                      <small>Enter your genuine website URL.</small>
                    </label>
                  </div>

                  <div className="brand-section-heading brand-assets-heading">
                    <div>
                      <span className="brand-section-kicker">
                        02 / DIGITAL PRESENCE
                      </span>
                      <h2>Official digital assets</h2>
                      <p>
                        Add your genuine social accounts and mobile apps.
                      </p>
                    </div>
                    <span className="brand-section-icon">
                      <Globe size={23} />
                    </span>
                  </div>

                  <div className="brand-asset-card">
                    <div className="brand-asset-icon">
                      <Globe size={21} />
                    </div>
                    <div className="brand-asset-content">
                      <h3>Social media accounts</h3>
                      <p>
                        Add official account handles or profile URLs.
                      </p>
                      <textarea
                        value={officialAccounts}
                        onChange={(event) => {
                          setOfficialAccounts(event.target.value);
                          setSavedBrand(false);
                        }}
                        rows={3}
                        placeholder="Instagram: @yourbrand&#10;LinkedIn: yourbrand&#10;Facebook: yourbrand"
                      />
                    </div>
                  </div>

                  <div className="brand-asset-card">
                    <div className="brand-asset-icon">
                      <Smartphone size={21} />
                    </div>
                    <div className="brand-asset-content">
                      <h3>Official mobile applications</h3>
                      <p>
                        Add official application names or app-store URLs.
                      </p>
                      <textarea
                        value={officialApps}
                        onChange={(event) => {
                          setOfficialApps(event.target.value);
                          setSavedBrand(false);
                        }}
                        rows={3}
                        placeholder="Official app name or app-store URL"
                      />
                    </div>
                  </div>

                  <div className="brand-profile-footer">
                    <div className="brand-save-note">
                      <ShieldCheck size={19} />
                      <span>
                       Your brand details are saved to the backend when you select Save Changes.
                      </span>
                    </div>

                    <button
                      className="primary-button brand-save-button"
                      type="submit"
                    >
                      <Save size={17} />
                      Save Changes
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {savedBrand && (
                    <div className="success-message brand-success-message">
                      <CheckCircle2 size={18} />
                      Brand profile saved successfully!
                    </div>
                  )}
                </form>
              </section>
            )}

            {/* MONITORING */}
            {activePage === "Monitoring" && (
              <section className="page-section">
                <SectionLabel>DISCOVERY WORKSPACE</SectionLabel>
                <h1>Social & app monitoring</h1>
                <p className="page-lead">
                  Explore how DigiShield organizes suspicious social
                  profiles, mobile apps, and look-alike names.
                </p>

                <div className="monitoring-hero panel">
                  <div className="monitoring-orbit">
                    <div className="orbit orbit-one" />
                    <div className="orbit orbit-two" />
                    <span>
                      <Radar size={38} />
                    </span>
                  </div>

                  <div className="monitoring-copy">
                    <span className="demo-pill">
                      <span /> SIMULATED WORKFLOW
                    </span>
                    <h2>Discover what looks suspicious.</h2>
                    <p>
                      Run a demonstration scan to explore sample findings.
                      Live platform monitoring is not connected.
                    </p>
                    <button
                      className="primary-button"
                      onClick={runDemoScan}
                    >
                      <ScanSearch size={17} />
                      Run demo scan
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="monitoring-feature-grid">
                  <div className="panel monitoring-feature">
                    <Fingerprint size={25} />
                    <h3>Social profile checks</h3>
                    <p>
                      Identify unusual account names and possible
                      brand impersonation.
                    </p>
                  </div>
                  <div className="panel monitoring-feature">
                    <Smartphone size={25} />
                    <h3>App identity checks</h3>
                    <p>
                      Review unverified apps that may reuse brand names
                      or logos.
                    </p>
                  </div>
                  <div className="panel monitoring-feature">
                    <Globe size={25} />
                    <h3>Look-alike checks</h3>
                    <p>
                      Compare similar spellings and suspicious variations.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* RESULTS AND REVIEW */}
            {activePage === "Results & Review" && (
              <section className="page-section">
                <SectionLabel>THREAT INTELLIGENCE</SectionLabel>
                <h1>Results & review</h1>
                <p className="page-lead">
                  Search, prioritize, and review the example findings in
                  this demo workspace.
                </p>

                <div className="panel results-panel">
                  <div className="results-toolbar">
                    <div className="search-field">
                      <Search size={18} />
                      <input
                        value={searchTerm}
                        onChange={(event) =>
                          setSearchTerm(event.target.value)
                        }
                        placeholder="Search assets or findings..."
                      />
                    </div>

                    <select
                      value={riskFilter}
                      onChange={(event) =>
                        setRiskFilter(event.target.value)
                      }
                      aria-label="Filter by risk"
                    >
                      <option value="All">All risk levels</option>
                      <option value="High">High risk</option>
                      <option value="Medium">Medium risk</option>
                      <option value="Low">Low risk</option>
                    </select>
                  </div>

                  <div className="results-count">
                    Showing <strong>{filteredThreats.length}</strong> of{" "}
                    {threats.length} sample findings
                  </div>

                  <div className="table-wrap">
                    <table className="threat-table">
                      <thead>
                        <tr>
                          <th>Suspected asset</th>
                          <th>Finding</th>
                          <th>Risk</th>
                          <th>Status</th>
                          <th>Review action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredThreats.map((threat) => (
                          <tr key={threat.id}>
                            <td>
                              <strong>{threat.asset}</strong>
                              <small>{threat.platform}</small>
                            </td>
                            <td>{threat.type}</td>
                            <td>
                              <span
                                className={`risk-label risk-${threat.risk.toLowerCase()}`}
                              >
                                {threat.risk}
                              </span>
                            </td>
                            <td>
                              <span className="status-label">
                                {threat.status}
                              </span>
                            </td>
                            <td>
                              <select
                                className="status-select"
                                value={threat.status}
                                onChange={(event) =>
                                  updateThreatStatus(
                                    threat.id,
                                    event.target.value
                                  )
                                }
                                aria-label={`Update status for ${threat.asset}`}
                              >
                                <option value="Under Review">Under Review</option>
<option value="Confirmed Threat">Confirmed Threat</option>
<option value="False Positive">False Positive</option>
                              </select>
                              
<button
  type="button"
  className="ai-analysis-button"
  onClick={() => analyzeFindingWithAI(threat.id)}
  disabled={aiLoadingId === threat.id}
>
  {aiLoadingId === threat.id
    ? "Analyzing..."
    : "Analyze with AI"}
</button>


                            </td>
                          </tr>
                        ))}

                        {filteredThreats.length === 0 && (
                          <tr>
                            <td colSpan="5" className="empty-state">
                              No findings match your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  
{filteredThreats
  .filter((threat) => aiAnalysis[threat.id])
  .map((threat) => (
    <div className="panel" key={threat.id}>
      <h3>AI Analysis: {threat.asset}</h3>
      <pre className="ai-analysis-result">
        {aiAnalysis[threat.id]}
      </pre>
    </div>
  ))}

                  <p className="table-disclaimer">
                    <AlertTriangle size={15} />
                    Sample records only. Risk labels are not based on live
                    analysis.
                  </p>
                </div>
              </section>
            )}

            {/* PERSONAL PROFILE */}
            {activePage === "Profile" && (
              <section className="page-section">
                <SectionLabel>ACCOUNT MANAGEMENT</SectionLabel>
                <h1>My Profile</h1>
                <p className="page-lead">
                  Manage your personal information and DigiShield account.
                </p>

                <form
                  className="panel brand-form profile-form"
                  onSubmit={saveProfile}
                >
                  <div className="profile-heading">
                    <div className="profile-large-avatar">
                      {(profileName.trim()[0] || "U").toUpperCase()}
                    </div>
                    <div>
                      <h2>{profileName || "Your Name"}</h2>
                      <p>{profileEmail || "Your email address"}</p>
                      <span className="demo-pill">
                        <span /> DEMO ACCOUNT
                      </span>
                    </div>
                  </div>

                  <div className="profile-divider" />

                  <label>
                    Full name
                    <input
                      type="text"
                      value={profileName}
                      onChange={(event) => {
                        setProfileName(event.target.value);
                        setProfileMessage("");
                      }}
                      placeholder="Enter your full name"
                      required
                    />
                  </label>

                  <label>
                    Email address
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(event) => {
                        setProfileEmail(event.target.value);
                        setProfileMessage("");
                      }}
                      placeholder="Enter your email address"
                      required
                    />
                  </label>

                  <div className="form-footnote">
                    <ShieldCheck size={16} />
                    Profile changes are stored in the current app session only.
                  </div>

                  {profileMessage && (
                    <div
                      className={
                        profileMessage === "Profile updated successfully."
                          ? "success-message"
                          : "auth-error"
                      }
                    >
                      {profileMessage === "Profile updated successfully." ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <AlertTriangle size={17} />
                      )}
                      {profileMessage}
                    </div>
                  )}

                  <button className="primary-button" type="submit">
                    <Save size={16} />
                    Save profile
                    <ArrowRight size={16} />
                  </button>
                </form>

                <div className="panel settings-panel">
                  <div className="settings-row">
                    <div className="settings-icon">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <strong>Account security</strong>
                      <p>
                        Authentication is handled by the backend. Live threat monitoring is not connected in this prototype.
                      </p>
                    </div>
                  </div>

                  <button className="secondary-button" onClick={logout}>
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </section>
            )}

            {/* SETTINGS */}
            {activePage === "Settings" && (
              <section className="page-section">
                <SectionLabel>WORKSPACE PREFERENCES</SectionLabel>
                <h1>Settings</h1>
                <p className="page-lead">
                  Manage your current demo workspace.
                </p>

                <div className="panel settings-panel">
                  <div className="settings-row">
                    <div className="settings-icon">
                      <UserRound size={20} />
                    </div>
                    <div>
                      <strong>Signed in as</strong>
                      <p>{email || "Demo account"}</p>
                    </div>
                  </div>

                  <div className="settings-row">
                    <div className="settings-icon">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <strong>Environment</strong>
                      <p>Demo mode — no live threat feeds connected</p>
                    </div>
                  </div>

                  <button
                    className="secondary-button"
                    onClick={openProfile}
                  >
                    <UserRound size={16} />
                    Manage profile
                  </button>

                  <button className="secondary-button" onClick={logout}>
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </section>
            )}

            <footer className="dashboard-footer">
              <span>© {new Date().getFullYear()} DigiShield</span>
              <span>
                <span className="status-dot" />
                Demo environment · No live monitoring
              </span>
            </footer>
          </div>
        </main>
      </div>
    );
  }

  // LANDING PAGE AND AUTHENTICATION MODAL
  return (
    <div className="site-shell">
      <header className="landing-header">
        <button className="brand-lockup" onClick={goLanding}>
          <BrandMark />
          <span>
            DigiShield<span className="brand-period">.</span>
          </span>
        </button>

        <nav className="landing-nav">
          <a href="#platform">Platform</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#workflow">How it works</a>
        </nav>

        <div className="header-actions">
          <button
            className="header-login"
            onClick={() => openAuth("login")}
          >
            Sign in
          </button>
          <button
            className="header-cta"
            onClick={() => openAuth("signup")}
          >
            Get started <ArrowRight size={15} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section" id="platform">
          <div className="hero-grid-pattern" />

          <div className="hero-copy">
            <SectionLabel>
              ENTERPRISE DIGITAL RISK PROTECTION
            </SectionLabel>
            <h1>
              Your brand is out there.
              <br />
              <span>Protect what makes it yours.</span>
            </h1>
            <p className="hero-description">
              DigiShield helps you discover suspicious social profiles,
              look-alike identities, and potentially fake mobile apps before
              they undermine customer trust.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button hero-primary"
                onClick={() => openAuth("signup")}
              >
                Protect your brand <ArrowRight size={17} />
              </button>
              <a className="hero-secondary" href="#capabilities">
                Explore the platform <ChevronRight size={17} />
              </a>
            </div>

            <div className="hero-trust-row">
              <span>
                <CheckCircle2 size={16} /> Brand-focused visibility
              </span>
              <span>
                <CheckCircle2 size={16} /> Review-ready findings
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="visual-grid" />
            <div className="scan-line" />
            <div className="radar-circle radar-circle-outer" />
            <div className="radar-circle radar-circle-middle" />
            <div className="radar-circle radar-circle-inner" />

            <div className="radar-center">
              <BrandMark />
              <span className="radar-pulse" />
            </div>

            <div className="radar-node node-one">
              <Fingerprint size={19} />
            </div>
            <div className="radar-node node-two">
              <Smartphone size={18} />
            </div>
            <div className="radar-node node-three">
              <Globe size={18} />
            </div>

            <div className="floating-alert alert-one">
              <span className="alert-icon">
                <AlertTriangle size={17} />
              </span>
              <span>
                <strong>Look-alike detected</strong>
                <small>Domain · High risk</small>
              </span>
              <span className="alert-dot" />
            </div>

            <div className="floating-alert alert-two">
              <span className="alert-icon">
                <Fingerprint size={17} />
              </span>
              <span>
                <strong>Suspicious profile</strong>
                <small>Social · Needs review</small>
              </span>
            </div>

            <div className="visual-caption">
              <span className="status-dot" />
              DIGITAL RISK VISIBILITY
            </div>
          </div>

          <div className="hero-bottom-line">
            <span>ONE WORKSPACE</span>
            <span className="line" />
            <span>MORE DIGITAL VISIBILITY</span>
            <span className="line" />
            <span>BETTER-INFORMED REVIEWS</span>
          </div>
        </section>

        <section className="intro-section" id="about">
          <div className="intro-title">
            <SectionLabel>THE CHALLENGE</SectionLabel>
            <h2>Your brand deserves to be protected.</h2>
          </div>
          <div className="intro-body">
            <p>
              Fake profiles, misleading apps, and look-alike identities can
              confuse customers and put your brand reputation at risk.
            </p>
            <p>
              DigiShield brings brand assets, suspicious findings, and review
              workflows together in one workspace.
            </p>
          </div>
        </section>

        <section className="capabilities-section" id="capabilities">
          <div className="section-heading-row">
            <div>
              <SectionLabel>BUILT FOR DIGITAL TRUST</SectionLabel>
              <h2>
                See the risks hiding
                <br />
                in plain sight.
              </h2>
            </div>
            <p>
              Discover, organize, and review potential threats to your
              digital identity.
            </p>
          </div>

          <div className="capability-grid">
            {features.map(
              ({ icon: Icon, number, title, description }) => (
                <article className="capability-card" key={number}>
                  <div className="capability-card-top">
                    <span className="capability-icon">
                      <Icon size={23} />
                    </span>
                    <span className="capability-number">{number}</span>
                  </div>
                  <span className="capability-tag">
                    DIGITAL PROTECTION
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <a href="#workflow" className="card-link">
                    Explore workflow <ArrowRight size={16} />
                  </a>
                </article>
              )
            )}
          </div>
        </section>

        <section className="platform-section">
          <div className="platform-visual">
            <div className="platform-window">
              <div className="window-top">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>THREAT REVIEW / SAMPLE VIEW</span>
                <ShieldCheck size={17} />
              </div>

              <div className="window-summary">
                <div>
                  <small>Potential findings</small>
                  <strong>04</strong>
                </div>
                <div>
                  <small>High risk</small>
                  <strong className="red-text">02</strong>
                </div>
                <div>
                  <small>Review queue</small>
                  <strong>04</strong>
                </div>
              </div>

              <div className="window-divider" />

              {initialThreats.slice(0, 3).map((threat) => (
                <div className="window-threat" key={threat.id}>
                  <span className="window-threat-icon">
                    <AlertTriangle size={16} />
                  </span>
                  <span className="window-threat-name">
                    <strong>{threat.asset}</strong>
                    <small>{threat.type}</small>
                  </span>
                  <span
                    className={`risk-label risk-${threat.risk.toLowerCase()}`}
                  >
                    {threat.risk}
                  </span>
                </div>
              ))}

              <div className="window-footer">
                <span className="status-dot" />
                SAMPLE DATA · DEMO PREVIEW
              </div>
            </div>
            <div className="platform-decoration platform-decoration-one" />
            <div className="platform-decoration platform-decoration-two" />
          </div>

          <div className="platform-copy">
            <SectionLabel>FROM SIGNAL TO REVIEW</SectionLabel>
            <h2>Turn scattered signals into a clearer picture.</h2>
            <p>
              Understand what was flagged, why it may matter, and what
              your team should review next.
            </p>
            <ul className="check-list">
              <li>
                <CheckCircle2 size={18} /> Centralized findings and risk labels
              </li>
              <li>
                <CheckCircle2 size={18} /> Official asset details and exclusions
              </li>
              <li>
                <CheckCircle2 size={18} /> Review status for each finding
              </li>
              <li>
                <CheckCircle2 size={18} /> A clear investigation workflow
              </li>
            </ul>
            <button
              className="primary-button"
              onClick={() => openAuth("signup")}
            >
              Explore your workspace <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="workflow-heading">
            <SectionLabel>A SIMPLE, STRUCTURED APPROACH</SectionLabel>
            <h2>From brand setup to threat review.</h2>
            <p>Three steps to demonstrate the DigiShield workflow.</p>
          </div>

          <div className="workflow-grid">
            <div className="workflow-step">
              <div className="workflow-step-top">
                <span>01</span>
                <BadgeCheck size={22} />
              </div>
              <h3>Register your brand</h3>
              <p>
                Add official websites, social handles, and app names.
              </p>
            </div>

            <div className="workflow-connector">
              <ArrowRight size={20} />
            </div>

            <div className="workflow-step">
              <div className="workflow-step-top">
                <span>02</span>
                <Search size={22} />
              </div>
              <h3>Discover potential risks</h3>
              <p>
                Explore suspicious names, profiles, pages, and apps.
              </p>
            </div>

            <div className="workflow-connector">
              <ArrowRight size={20} />
            </div>

            <div className="workflow-step">
              <div className="workflow-step-top">
                <span>03</span>
                <CheckCircle2 size={22} />
              </div>
              <h3>Review and prioritize</h3>
              <p>
                Examine findings and track investigation status.
              </p>
            </div>
          </div>

          <p className="workflow-disclaimer">
            This prototype uses sample data. Real monitoring requires
            connected data sources and validation.
          </p>
        </section>

        <section className="cta-section">
          <div className="cta-pattern" />
          <div className="cta-content">
            <SectionLabel>
              TAKE CONTROL OF YOUR DIGITAL PRESENCE
            </SectionLabel>
            <h2>
              Make digital trust
              <br />
              <span>a priority.</span>
            </h2>
            <p>
              Start with your brand profile and explore the DigiShield
              demo workspace.
            </p>
            <button
              className="primary-button cta-button"
              onClick={() => openAuth("signup")}
            >
              Get started with DigiShield <ArrowRight size={17} />
            </button>
          </div>
          <div className="cta-shield">
            <BrandMark />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <button className="brand-lockup footer-brand" onClick={goLanding}>
          <BrandMark />
          <span>
            DigiShield<span className="brand-period">.</span>
          </span>
        </button>
        <p>
          Digital risk protection. Clearer visibility. Better-informed decisions.
        </p>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} DigiShield. All rights reserved.
          </span>
          <span>Prototype · Demo environment</span>
        </div>
      </footer>

      {/* LOGIN AND SIGNUP MODAL */}
      {screen === "auth" && (
        <div
          className="auth-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setScreen("landing");
            }
          }}
        >
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="auth-close"
              onClick={() => setScreen("landing")}
              aria-label="Close sign in"
            >
              <X size={20} />
            </button>

            <div className="auth-modal-brand">
              <BrandMark />
              <span>
                DigiShield<span className="brand-period">.</span>
              </span>
            </div>

            <div className="auth-intro">
              <span className="auth-mini-label">
                <ShieldCheck size={14} /> YOUR DIGITAL TRUST WORKSPACE
              </span>
              <h2 id="auth-title">
                {authMode === "login"
                  ? "Welcome back."
                  : "Protect your brand."}
              </h2>
              <p>
                {authMode === "login"
                  ? "Sign in to explore your digital risk workspace."
                  : "Create a demo account and get started with DigiShield."}
              </p>
            </div>

            <div className="auth-tabs">
              <button
                className={
                  authMode === "login" ? "auth-tab active" : "auth-tab"
                }
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
              >
                Sign in
              </button>
              <button
                className={
                  authMode === "signup" ? "auth-tab active" : "auth-tab"
                }
                onClick={() => {
                  setAuthMode("signup");
                  setAuthError("");
                }}
              >
                Create account
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAuth}>
              {authMode === "signup" && (
                <label>
                  Full name
                  <span className="input-wrap">
                    <UserRound size={17} />
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Enter your name"
                      autoComplete="name"
                      required
                    />
                  </span>
                </label>
              )}

              <label>
                Email address
                <span className="input-wrap">
                  <Mail size={17} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </span>
              </label>

              <label>
                Password
                <span className="input-wrap">
                  <LockKeyhole size={17} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete={
                      authMode === "login"
                        ? "current-password"
                        : "new-password"
                    }
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </span>
              </label>

              {authError && (
                <div className="auth-error">
                  <AlertTriangle size={16} />
                  {authError}
                </div>
              )}

              <button
                className="primary-button auth-submit"
                type="submit"
              >
                {authMode === "login"
                  ? "Sign in to workspace"
                  : "Create demo account"}
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="auth-demo-note">
              <ShieldCheck size={17} />
              <p>
                <strong>Prototype access</strong>
                <br />
               Enter your registered email and password to sign in, or create an account with a password of at least 8 characters.
              </p>
            </div>

            <p className="auth-switch">
              {authMode === "login"
                ? "New to DigiShield?"
                : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setAuthMode(
                    authMode === "login" ? "signup" : "login"
                  );
                  setAuthError("");
                }}
              >
                {authMode === "login"
                  ? "Create an account"
                  : "Sign in"}
              </button>
            </p>
          </section>
        </div>
      )}
        </div>

  );
}

export default App;
