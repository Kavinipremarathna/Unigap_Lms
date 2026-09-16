"use client";

export type CertificateTheme = "parchment" | "purple" | "gold" | "emerald" | "navy" | "slate";
export type CertificateBorderStyle = "double" | "ornate" | "modern" | "minimal";
export type CertificateSealStyle = "shield" | "gold_medal" | "crest" | "star";

export interface CertificateTemplateConfig {
  theme: CertificateTheme;
  borderStyle: CertificateBorderStyle;
  institutionName: string;
  certificateTitle: string;
  subTitle?: string;
  presentationText: string;
  completionStatement: string;
  signatoryName: string;
  signatoryTitle: string;
  sealStyle: CertificateSealStyle;
  accentColor: string;
  customBadgeText?: string;
}

export interface IssuedCertificateData {
  id: string;
  certificateHash: string;
  recipientName: string;
  recipientEmail?: string;
  courseTitle: string;
  issueDate: string;
  grade?: string;
  instructorName?: string;
  templateConfig?: CertificateTemplateConfig;
}

export const DEFAULT_CERTIFICATE_TEMPLATE: CertificateTemplateConfig = {
  theme: "parchment",
  borderStyle: "ornate",
  institutionName: "UNIGAP Learn",
  certificateTitle: "CERTIFICATE",
  subTitle: "OF AUTHENTICITY",
  presentationText: "THIS CERTIFICATE IS PROUDLY PRESENTED TO",
  completionStatement: "for successfully completing all curriculum modules, practical assessments, and academic evaluations for the course:",
  signatoryName: "Dr. Alexander Reed",
  signatoryTitle: "Academic Director",
  sealStyle: "crest",
  accentColor: "#5c5346",
  customBadgeText: "Verified Credential",
};

const STORAGE_KEY = "unigap_certificate_template_config";

export function getCertificateTemplate(): CertificateTemplateConfig {
  if (typeof window === "undefined") return DEFAULT_CERTIFICATE_TEMPLATE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_CERTIFICATE_TEMPLATE;
    const parsed = JSON.parse(saved);
    return { ...DEFAULT_CERTIFICATE_TEMPLATE, ...parsed };
  } catch {
    return DEFAULT_CERTIFICATE_TEMPLATE;
  }
}

export function saveCertificateTemplate(config: CertificateTemplateConfig): CertificateTemplateConfig {
  if (typeof window === "undefined") return config;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("unigap_certificate_template_updated"));
  } catch (err) {
    console.error("Save certificate template error:", err);
  }
  return config;
}

function getUserKey(): string {
  if (typeof window === "undefined") return "guest";
  try {
    const storedUser = localStorage.getItem("unigap_auth_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      return u.id || u.email || "guest";
    }
  } catch {
    // fallback
  }
  return "guest";
}

export function getUserCertificates(): IssuedCertificateData[] {
  if (typeof window === "undefined") return [];
  try {
    const userKey = getUserKey();
    const key = `unigap_user_certificates_${userKey}`;
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function generateCourseCertificate(
  courseTitle: string,
  recipientName?: string,
  recipientEmail?: string,
  scorePercentage?: number
): IssuedCertificateData {
  const templateConfig = getCertificateTemplate();

  // Get user name from auth storage if not provided
  let finalRecipientName = recipientName;
  let finalRecipientEmail = recipientEmail;

  if (typeof window !== "undefined" && !finalRecipientName) {
    try {
      const authUserStr = localStorage.getItem("unigap_auth_user");
      if (authUserStr) {
        const u = JSON.parse(authUserStr);
        finalRecipientName = u.name || u.email || "Enrolled Student";
        finalRecipientEmail = u.email;
      }
    } catch {
      // fallback
    }
  }

  if (!finalRecipientName) {
    finalRecipientName = "Enrolled Student";
  }

  const hashId = Math.random().toString(36).substring(2, 7).toUpperCase();
  const certId = `cert-${Date.now()}`;
  const certificateHash = `UNI-CERT-2026-${hashId}`;

  const issueDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate Distinction based on score (>= 75% = Excellent Distinction)
  const calcScore = typeof scorePercentage === "number" ? Math.round(scorePercentage) : 95;
  let calculatedGrade = `Excellent (Distinction - ${calcScore}%)`;

  if (calcScore < 75 && calcScore >= 50) {
    calculatedGrade = `Pass (Good - ${calcScore}%)`;
  } else if (calcScore < 50) {
    calculatedGrade = `Satisfactory (${calcScore}%)`;
  }

  const newCertificate: IssuedCertificateData = {
    id: certId,
    certificateHash,
    recipientName: finalRecipientName,
    recipientEmail: finalRecipientEmail,
    courseTitle,
    issueDate,
    grade: calculatedGrade,
    instructorName: templateConfig.signatoryName,
    templateConfig,
  };

  if (typeof window !== "undefined") {
    try {
      // Save to user's personal certificate collection
      const userKey = getUserKey();
      const userCertKey = `unigap_user_certificates_${userKey}`;
      const existingUserCerts = getUserCertificates();
      
      // Prevent duplicates for same course
      const filtered = existingUserCerts.filter((c) => c.courseTitle !== courseTitle);
      const updatedUserCerts = [newCertificate, ...filtered];
      localStorage.setItem(userCertKey, JSON.stringify(updatedUserCerts));

      // Save to global admin registry storage
      const adminData = localStorage.getItem("unigap_admin_certificates");
      const adminCerts = adminData ? JSON.parse(adminData) : [];
      const adminFiltered = adminCerts.filter(
        (c: any) => !(c.courseTitle === courseTitle && c.recipientName === finalRecipientName)
      );
      localStorage.setItem("unigap_admin_certificates", JSON.stringify([newCertificate, ...adminFiltered]));

      // Sync to PostgreSQL database via API
      if (finalRecipientEmail) {
        fetch("/api/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: finalRecipientEmail,
            courseTitle,
            certNumber: certificateHash,
            grade: calculatedGrade,
          }),
        }).catch((err) => console.error("PostgreSQL certificate sync error:", err));
      }

      window.dispatchEvent(new Event("unigap_certificates_updated"));
    } catch (e) {
      console.error("Save generated certificate error:", e);
    }
  }

  return newCertificate;
}
