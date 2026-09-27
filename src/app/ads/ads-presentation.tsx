"use client";

import { useEffect } from "react";
import {
  ArrowDown,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Check,
  CircleCheck,
  CircleX,
  Clock3,
  Database,
  Facebook,
  Gauge,
  Globe2,
  HeartHandshake,
  Infinity,
  Instagram,
  Layers3,
  LineChart,
  Mail,
  Megaphone,
  MessageCircleReply,
  MousePointerClick,
  RefreshCw,
  Rocket,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  WalletCards,
  Wrench,
  Zap,
} from "lucide-react";
import styles from "./ads.module.css";

const channelCards = [
  {
    className: styles.metaCard,
    icon: Infinity,
    eyebrow: "META ADS",
    title: "Facebook + Instagram",
    metric: "۵۰ DKK",
    metricLabel: "بودجه آزمایشی روزانه",
    text: "تبلیغ محلی، هدف‌گیری دقیق و تست چند پیام برای پیدا کردن تبلیغ برنده.",
    tags: ["Local audience", "A/B test", "Retargeting"],
  },
  {
    className: styles.googleCard,
    icon: Search,
    eyebrow: "GOOGLE ADS",
    title: "حفظ بودجه فعلی",
    metric: "بدون افزایش",
    metricLabel: "فعلاً بهینه‌سازی، نه هزینه بیشتر",
    text: "تمرکز روی کلمات پرفروش، حذف کلیک‌های بی‌کیفیت و اندازه‌گیری تماس و رزرو.",
    tags: ["Search intent", "Negative keywords", "Tracking"],
  },
  {
    className: styles.emailCard,
    icon: Mail,
    eyebrow: "EMAIL",
    title: "بانک مشتری آماده",
    metric: "۲۵۰۰",
    metricLabel: "ایمیل قابل استفاده",
    text: "یک ایمیل کوتاه در هفته با پیشنهاد روشن، فصل مناسب و لینک مستقیم رزرو.",
    tags: ["Weekly", "Offer", "Reactivation"],
  },
  {
    className: styles.webCard,
    icon: Globe2,
    eyebrow: "WEBSITE",
    title: "تعویض کامل و مرحله‌ای",
    metric: "۳–۵ هفته",
    metricLabel: "زمان اجرای وب‌سایت جدید",
    text: "در یک برنامه فشرده، صفحات مهم را بدون توقف فروش به تجربه سریع‌تر و مدرن‌تر منتقل می‌کنیم.",
    tags: ["Speed", "Mobile", "Conversion"],
  },
];

const roadmap = [
  {
    number: "۰۱",
    period: "هفته اول",
    title: "بستن نشتی",
    text: "Tracking، مسیر رزرو، Trustpilot و دلیل کنسلی‌ها",
    icon: Wrench,
  },
  {
    number: "۰۲",
    period: "ماه اول",
    title: "شروع موتور فروش",
    text: "Meta روزانه + ایمیل هفتگی + بهینه‌سازی Google",
    icon: Rocket,
  },
  {
    number: "۰۳",
    period: "هفته ۳–۵",
    title: "راه‌اندازی سایت جدید",
    text: "انتقال صفحات کلیدی و تکمیل زیرساخت جدید Eluxus",
    icon: Layers3,
  },
  {
    number: "۰۴",
    period: "ماه سوم",
    title: "بهینه‌سازی و رشد",
    text: "افزایش بودجه فقط برای کانال‌های سودده",
    icon: TrendingUp,
  },
];

export function AdsPresentation() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-ads-reveal]"));
    const page = document.querySelector<HTMLElement>("[data-ads-page]");
    const tiltElements = Array.from(document.querySelectorAll<HTMLElement>("[data-ads-tilt]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add(styles.visible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    elements.forEach((element) => observer.observe(element));

    const handlePagePointer = (event: PointerEvent) => {
      page?.style.setProperty("--spot-x", `${(event.clientX / window.innerWidth) * 100}%`);
      page?.style.setProperty("--spot-y", `${(event.clientY / window.innerHeight) * 100}%`);
    };

    const cleanupTilt = tiltElements.map((element) => {
      const handleTilt = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        element.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
        element.style.setProperty("--tilt-y", `${(x - 0.5) * 6}deg`);
        element.style.setProperty("--glow-x", `${x * 100}%`);
        element.style.setProperty("--glow-y", `${y * 100}%`);
      };
      const resetTilt = () => {
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-y", "0deg");
      };

      element.addEventListener("pointermove", handleTilt);
      element.addEventListener("pointerleave", resetTilt);
      return () => {
        element.removeEventListener("pointermove", handleTilt);
        element.removeEventListener("pointerleave", resetTilt);
      };
    });

    window.addEventListener("pointermove", handlePagePointer, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePagePointer);
      cleanupTilt.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <main className={styles.page} dir="rtl" lang="fa" data-ads-page>
      <div className={styles.noise} aria-hidden="true" />

      <section className={styles.hero} id="top">
        <nav className={styles.nav}>
          <a className={styles.brand} href="#top" dir="ltr">
            <span>E</span>
            <strong>ELUXUS</strong>
          </a>
          <div className={styles.navLabel}>
            <span className={styles.liveDot} />
            GROWTH ROADMAP · 2026
          </div>
        </nav>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy} data-ads-reveal>
            <div className={styles.kicker}>
              <ShieldAlert size={17} />
              برنامه بقا، بازسازی و رشد
            </div>
            <h1>
              <span dir="ltr">SURVIVE</span>
              <span className={styles.outlineTitle} dir="ltr">
                THE ELUXUS
              </span>
            </h1>
            <p className={styles.heroLead}>
              اول اعتماد را برمی‌گردانیم.
              <br />
              بعد تبلیغات را به فروش تبدیل می‌کنیم.
            </p>

            <div className={styles.heroStats}>
              <div>
                <strong>۵۰</strong>
                <span>DKK / روز در Meta</span>
              </div>
              <div>
                <strong>۲۵۰۰</strong>
                <span>ایمیل آماده فعال‌سازی</span>
              </div>
              <div>
                <strong>۱۰۰۰</strong>
                <span>DKK مدیریت ماهانه</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual} data-ads-reveal>
            <div className={styles.orbitOuter}>
              <div className={`${styles.orbitItem} ${styles.orbitMeta}`}>
                <Facebook size={20} />
              </div>
              <div className={`${styles.orbitItem} ${styles.orbitGoogle}`}>
                <Search size={20} />
              </div>
              <div className={`${styles.orbitItem} ${styles.orbitMail}`}>
                <Mail size={20} />
              </div>
              <div className={`${styles.orbitItem} ${styles.orbitStar}`}>
                <Star size={20} fill="currentColor" />
              </div>
              <div className={styles.orbitInner}>
                <div className={styles.coreGlow} />
                <div className={styles.core}>
                  <span>WM</span>
                  <small>REBUILD</small>
                </div>
              </div>
            </div>
            <div className={styles.signalCard}>
              <span>هدف ۹۰ روزه</span>
              <strong>اعتماد + فروش پایدار</strong>
              <TrendingUp size={22} />
            </div>
          </div>
        </div>

        <a className={styles.scrollCue} href="#problem" aria-label="رفتن به بخش بعد">
          <ArrowDown size={18} />
          <span>مشاهده برنامه</span>
        </a>
      </section>

      <section className={styles.problemSection} id="problem">
        <div className={styles.sectionHeading} data-ads-reveal>
          <span className={styles.sectionNumber}>01</span>
          <div>
            <p>THE REAL PROBLEM</p>
            <h2>تبلیغ مشتری می‌آورد؛ بی‌اعتمادی او را برمی‌گرداند.</h2>
          </div>
        </div>

        <div className={styles.leakFlow} data-ads-reveal>
          <div className={styles.flowStep}>
            <div className={styles.flowIcon}>
              <Megaphone size={24} />
            </div>
            <span>تبلیغ</span>
            <small>دیده می‌شویم</small>
          </div>
          <ArrowLeft className={styles.flowArrow} />
          <div className={styles.flowStep}>
            <div className={styles.flowIcon}>
              <MousePointerClick size={24} />
            </div>
            <span>وب‌سایت</span>
            <small>علاقه ایجاد می‌شود</small>
          </div>
          <ArrowLeft className={styles.flowArrow} />
          <div className={`${styles.flowStep} ${styles.dangerStep}`}>
            <div className={styles.flowIcon}>
              <Star size={24} />
            </div>
            <span>Trustpilot</span>
            <small>اعتماد از بین می‌رود</small>
          </div>
          <ArrowLeft className={styles.flowArrow} />
          <div className={`${styles.flowStep} ${styles.cancelStep}`}>
            <div className={styles.flowIcon}>
              <CircleX size={24} />
            </div>
            <span>کنسلی</span>
            <small>فروش از دست می‌رود</small>
          </div>
        </div>

        <div className={styles.problemCallout} data-ads-reveal>
          <Zap size={26} />
          <strong>قانون اول:</strong>
          <span>قبل از افزایش تبلیغات، نشتی اعتماد را می‌بندیم.</span>
        </div>
      </section>

      <section className={styles.channelsSection}>
        <div className={styles.sectionHeading} data-ads-reveal>
          <span className={styles.sectionNumber}>02</span>
          <div>
            <p>4 GROWTH ENGINES</p>
            <h2>چهار موتور برای برگشتن به مسیر رشد</h2>
          </div>
        </div>

        <div className={styles.channelGrid}>
          {channelCards.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <article
                className={`${styles.channelCard} ${channel.className}`}
                data-ads-reveal
                data-ads-tilt
                style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}
                key={channel.eyebrow}
              >
                <div className={styles.channelTop}>
                  <div className={styles.channelIcon}>
                    <Icon size={26} />
                  </div>
                  <span>{channel.eyebrow}</span>
                </div>
                <h3>{channel.title}</h3>
                <div className={styles.channelMetric}>
                  <strong>{channel.metric}</strong>
                  <small>{channel.metricLabel}</small>
                </div>
                <p>{channel.text}</p>
                <div className={styles.tagRow}>
                  {channel.tags.map((tag) => (
                    <span dir="ltr" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.metaSection}>
        <div className={styles.metaCopy} data-ads-reveal>
          <div className={styles.kicker}>
            <Facebook size={17} />
            META · FACEBOOK · INSTAGRAM
          </div>
          <h2>
            با روزی <em>۵۰ کرون</em>
            <br />
            بازار را تست می‌کنیم.
          </h2>
          <p>
            هدف آزمایشی: رسیدن به ۱ تا ۲ مشتری در روز. نتیجه تضمین نیست؛ هر هفته با عدد واقعی
            تصمیم می‌گیریم.
          </p>
          <div className={styles.platforms}>
            <span>
              <Facebook size={18} /> Facebook Ads
            </span>
            <span>
              <Instagram size={18} /> Instagram Ads
            </span>
          </div>
        </div>

        <div className={styles.adMachine} data-ads-reveal data-ads-tilt>
          <div className={styles.machineHeader}>
            <span>DAILY AD MACHINE</span>
            <div>
              <i />
              LIVE TEST
            </div>
          </div>
          <div className={styles.machineFlow}>
            <div className={styles.machineNode}>
              <WalletCards size={24} />
              <strong>۵۰ DKK</strong>
              <small>بودجه روزانه</small>
            </div>
            <div className={styles.pulseLine}>
              <i />
            </div>
            <div className={styles.machineNode}>
              <Users size={24} />
              <strong>مخاطب محلی</strong>
              <small>نزدیک محدوده سرویس</small>
            </div>
            <div className={styles.pulseLine}>
              <i />
            </div>
            <div className={`${styles.machineNode} ${styles.resultNode}`}>
              <Target size={24} />
              <strong>۱–۲ مشتری</strong>
              <small>هدف تست روزانه</small>
            </div>
          </div>
          <div className={styles.machineFooter}>
            <LineChart size={19} />
            <span>اگر یک سفارش هزینه تبلیغ را پوشش دهد، تست ارزش ادامه‌دادن دارد.</span>
          </div>
        </div>
      </section>

      <section className={styles.trustSection}>
        <div className={styles.trustVisual} data-ads-reveal>
          <div className={styles.reviewCard} data-ads-tilt>
            <div className={styles.reviewBrand}>
              <Star size={24} fill="currentColor" />
              <strong>Trustpilot</strong>
            </div>
            <div className={styles.ratingLine}>
              <strong>اعتماد</strong>
              <div>
                <span />
                <span />
                <span />
                <span className={styles.emptyStar} />
                <span className={styles.emptyStar} />
              </div>
            </div>
            <div className={styles.reviewRows}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.cancelBadge}>
              <CircleX size={18} />
              مشتری قبل از رزرو منصرف شد
            </div>
          </div>
          <div className={styles.repairRing}>
            <RefreshCw size={30} />
          </div>
        </div>

        <div className={styles.trustCopy} data-ads-reveal>
          <span className={styles.sectionNumber}>03</span>
          <p className={styles.miniTitle}>TRUST REPAIR</p>
          <h2>Trustpilot باید قبل از Scale اصلاح شود.</h2>
          <div className={styles.actionList}>
            <div>
              <MessageCircleReply size={21} />
              <span>پاسخ حرفه‌ای به نظرهای منفی</span>
            </div>
            <div>
              <Star size={21} />
              <span>درخواست نظر واقعی از مشتریان راضی جدید</span>
            </div>
            <div>
              <ShieldCheck size={21} />
              <span>اصلاح پروفایل، پیام برند و روند خدمات</span>
            </div>
            <div>
              <RefreshCw size={21} />
              <span>اگر قابل نجات نبود: بررسی شروع مجدد فقط طبق قوانین پلتفرم</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.websiteSection}>
        <div className={styles.sectionHeading} data-ads-reveal>
          <span className={styles.sectionNumber}>04</span>
          <div>
            <p>WEBSITE EVOLUTION</p>
            <h2>در ۳ تا ۵ هفته، وب‌سایت جدید را مرحله‌ای جایگزین می‌کنیم.</h2>
          </div>
        </div>

        <div className={styles.websiteGrid}>
        <div className={styles.browserMockup} data-ads-reveal data-ads-tilt>
            <div className={styles.browserBar}>
              <span />
              <span />
              <span />
              <div>eluxus.dk</div>
            </div>
            <div className={styles.browserBody}>
              <div className={styles.oldSite}>
                <small>NOW</small>
                <strong>OLD WEBSITE</strong>
                <div className={styles.skeletonLines}>
                  <i />
                  <i />
                  <i />
                </div>
                <span>وب‌سایت فعلی</span>
              </div>
              <div className={styles.migrationArrow}>
                <ArrowLeft />
                <small>STEP BY STEP</small>
              </div>
              <div className={styles.newSite}>
                <small>NEXT</small>
                <strong>ELUXUS</strong>
                <div className={styles.newDashboard}>
                  <i />
                  <i />
                  <i />
                </div>
                <span>سریع + مدرن</span>
              </div>
            </div>
          </div>

          <div className={styles.migrationPlan} data-ads-reveal data-ads-tilt>
            <div className={styles.eluxusBadge}>
              <Sparkles size={22} />
              <div>
                <strong>Eluxus آماده است</strong>
                <span>ساخته‌شده حدود یک ماه پیش + جزئیات اضافه</span>
              </div>
            </div>
            {[
              ["۱", "اصلاح موبایل، سرعت و پیام اصلی"],
              ["۲", "انتقال صفحات رزرو و خدمات پرفروش"],
              ["۳", "SEO، Analytics و Conversion tracking"],
              ["۴", "حذف تدریجی بخش‌های قدیمی"],
            ].map(([number, text]) => (
              <div className={styles.migrationItem} key={number}>
                <span>{number}</span>
                <p>{text}</p>
                <Check size={18} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.emailSection}>
        <div className={styles.emailCopy} data-ads-reveal>
          <span className={styles.sectionNumber}>05</span>
          <p className={styles.miniTitle}>OWNED AUDIENCE</p>
          <h2>
            ما از قبل
            <br />
            <em>۲۵۰۰ مشتری بالقوه</em> داریم.
          </h2>
          <p>به‌جای خرید دوباره همان مخاطب، هر هفته با یک پیام مفید او را برمی‌گردانیم.</p>
          <div className={styles.emailTarget}>
            <Target size={24} />
            <div>
              <strong>حداقل ۲–۳ کار در هفته</strong>
              <span>هدف اولیه از Email Reactivation</span>
            </div>
          </div>
        </div>

        <div className={styles.inboxVisual} data-ads-reveal>
          <div className={styles.databaseCore}>
            <Database size={28} />
            <strong>۲۵۰۰</strong>
            <span>CONTACTS</span>
          </div>
          <div className={`${styles.mailBubble} ${styles.mailOne}`}>
            <CalendarDays size={18} />
            پیشنهاد این هفته
          </div>
          <div className={`${styles.mailBubble} ${styles.mailTwo}`}>
            <Send size={18} />
            ارسال چهارشنبه
          </div>
          <div className={`${styles.mailBubble} ${styles.mailThree}`}>
            <BarChart3 size={18} />
            کلیک و رزرو
          </div>
          <svg className={styles.emailLines} viewBox="0 0 500 360" aria-hidden="true">
            <path d="M245 175 C140 125, 105 95, 70 70" />
            <path d="M260 175 C370 120, 395 105, 430 85" />
            <path d="M250 190 C330 265, 365 275, 430 285" />
          </svg>
        </div>
      </section>

      <section className={styles.roadmapSection}>
        <div className={styles.sectionHeading} data-ads-reveal>
          <span className={styles.sectionNumber}>06</span>
          <div>
            <p>90-DAY ROADMAP</p>
            <h2>از بقا تا رشد، در چهار حرکت روشن</h2>
          </div>
        </div>

        <div className={styles.roadmap}>
          <div className={styles.roadLine} />
          {roadmap.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                className={styles.roadItem}
                data-ads-reveal
                style={{ "--delay": `${index * 110}ms` } as React.CSSProperties}
                key={item.number}
              >
                <div className={styles.roadMarker}>
                  <Icon size={22} />
                </div>
                <span>{item.period}</span>
                <small>{item.number}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.costSection}>
        <div className={styles.costCard} data-ads-reveal data-ads-tilt>
          <div className={styles.costTop}>
            <div>
              <p>MONTHLY MANAGEMENT</p>
              <h2>مدیریت کامل رشد</h2>
            </div>
            <Gauge size={38} />
          </div>
          <div className={styles.price}>
            <strong>۱۰۰۰</strong>
            <div>
              <span>DKK</span>
              <small>اضافه / ماهانه</small>
            </div>
          </div>
          <div className={styles.included}>
            {["Meta Ads", "Google optimization", "Email weekly", "Website improvements"].map(
              (item) => (
                <span key={item}>
                  <CircleCheck size={16} />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className={styles.paymentCard} data-ads-reveal data-ads-tilt>
          <HeartHandshake size={42} />
          <p>هزینه Eluxus و جزئیات اضافه‌شده</p>
          <h3>وقتی امکانش بود پرداخت کن.</h3>
          <span>پرداخت ماهانه ۱۰۰۰ DKK · بدون عجله</span>
          <div className={styles.paymentNote}>
            <Clock3 size={18} />
            بودجه مستقیم تبلیغات جدا از هزینه مدیریت است.
          </div>
        </div>
      </section>

      <footer className={styles.finalSection}>
        <div className={styles.finalGlow} />
        <div data-ads-reveal>
          <p>THE PLAN IS SIMPLE</p>
          <h2>
            بقا <span>←</span> اعتماد <span>←</span> فروش <span>←</span> رشد
          </h2>
          <div className={styles.finalBadge}>
            <Rocket size={22} />
            <span dir="ltr">SURVIVE THE ELUXUS</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
