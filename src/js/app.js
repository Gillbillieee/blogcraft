// ===== BlogCraft — AI Blog Post Writer =====
(function() {
  'use strict';

  let currentTemplate = 'howto';

  const sampleData = {
    topic: '10 Proven Strategies to Grow Your Email List in 2026',
    tone: 'professional',
    length: 'medium',
    keywords: 'email marketing, grow list, lead generation, email subscribers',
    audience: 'small business owners and digital marketers',
    includeSections: '',
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadDraft();
  });

  // ===== Template Selection =====
  window.selectTemplate = function(name) {
    currentTemplate = name;
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
    event.target.closest('.template-card').classList.add('active');
  };

  // ===== Load Sample Data =====
  window.loadSample = function() {
    Object.keys(sampleData).forEach(key => {
      const el = document.getElementById(key);
      if (el) el.value = sampleData[key];
    });
    showToast('Sample data loaded!');
  };

  // ===== Generate Blog Post =====
  window.generatePost = function() {
    const topic = document.getElementById('topic').value.trim();
    if (!topic) {
      shakeElement(document.getElementById('topic'));
      return;
    }

    const tone = document.getElementById('tone').value;
    const length = document.getElementById('length').value;
    const keywords = document.getElementById('keywords').value.split(',').map(k => k.trim()).filter(Boolean);
    const audience = document.getElementById('audience').value.trim();
    const sections = document.getElementById('includeSections').value.split('\n').filter(s => s.trim());

    document.getElementById('postOutput').style.display = 'none';
    document.getElementById('postLoading').style.display = 'block';

    setTimeout(() => {
      const post = generateBlogPost(topic, tone, length, keywords, audience, sections);
      renderPost(post, topic);
      document.getElementById('postOutput').style.display = 'block';
      document.getElementById('postLoading').style.display = 'none';
      saveDraft();
    }, 1000);
  };

  function generateBlogPost(topic, tone, length, keywords, audience, sections) {
    const wordCountMap = { short: 500, medium: 1000, long: 1500 };
    const targetWords = wordCountMap[length] || 1000;

    // Generate outline based on template
    const outline = generateOutline(topic, currentTemplate, sections);

    // Generate content for each section
    let content = '';
    outline.forEach((section, idx) => {
      if (idx === 0) {
        // Introduction - special handling
        content += generateIntroduction(section.title, topic, tone, audience, targetWords);
      } else if (idx === outline.length - 1) {
        // Conclusion - special handling
        content += generateConclusion(section.title, topic, tone, keywords, targetWords);
      } else {
        content += generateSection(section.title, section.subpoints || [], topic, tone, audience, targetWords / outline.length);
      }
    });

    return { title: topic, content: content, keywords: keywords };
  }

  function generateOutline(topic, template, sections) {
    if (sections && sections.length > 0) {
      // User-provided sections
      const outline = [{ title: 'Introduction', subpoints: [] }];
      sections.forEach(s => {
        if (s.trim()) {
          outline.push({ title: s.trim(), subpoints: generateSubpoints(s.trim()) });
        }
      });
      outline.push({ title: 'Conclusion', subpoints: [] });
      return outline;
    }

    // Template-based outlines
    const outlines = {
      howto: [
        { title: 'Introduction', subpoints: [] },
        { title: 'What You\'ll Learn', subpoints: ['Overview of the strategy', 'Why it matters'] },
        { title: 'Step 1: Set Clear Goals', subpoints: ['Define your objectives', 'Set measurable targets'] },
        { title: 'Step 2: Identify Your Audience', subpoints: ['Create buyer personas', 'Understand pain points'] },
        { title: 'Step 3: Choose the Right Channels', subpoints: ['Evaluate options', 'Select based on audience'] },
        { title: 'Step 4: Create Compelling Content', subpoints: ['Write engaging copy', 'Use visuals effectively'] },
        { title: 'Step 5: Test and Optimize', subpoints: ['Run A/B tests', 'Analyze results'] },
        { title: 'Conclusion', subpoints: [] },
      ],
      listicle: [
        { title: 'Introduction', subpoints: [] },
        { title: '#1: Strategy One', subpoints: ['Why it works', 'How to implement'] },
        { title: '#2: Strategy Two', subpoints: ['Why it works', 'How to implement'] },
        { title: '#3: Strategy Three', subpoints: ['Why it works', 'How to implement'] },
        { title: '#4: Strategy Four', subpoints: ['Why it works', 'How to implement'] },
        { title: '#5: Strategy Five', subpoints: ['Why it works', 'How to implement'] },
        { title: 'Conclusion', subpoints: [] },
      ],
      comparison: [
        { title: 'Introduction', subpoints: [] },
        { title: 'Overview of Option A', subpoints: ['Key features', 'Best for'] },
        { title: 'Overview of Option B', subpoints: ['Key features', 'Best for'] },
        { title: 'Feature Comparison', subpoints: ['Performance', 'Ease of use', 'Pricing'] },
        { title: 'Pros and Cons', subpoints: ['Option A advantages', 'Option B advantages'] },
        { title: 'Which Should You Choose?', subpoints: ['Decision framework', 'Final recommendation'] },
        { title: 'Conclusion', subpoints: [] },
      ],
      opinion: [
        { title: 'Introduction', subpoints: [] },
        { title: 'The Current State of Affairs', subpoints: ['What\'s happening now', 'Why it matters'] },
        { title: 'Why Most People Get It Wrong', subpoints: ['Common misconceptions', 'The real issue'] },
        { title: 'A Different Perspective', subpoints: ['Alternative viewpoint', 'Evidence to support'] },
        { title: 'What Needs to Change', subpoints: ['Proposed solutions', 'Implementation steps'] },
        { title: 'Conclusion', subpoints: [] },
      ],
    };

    return outlines[currentTemplate] || outlines.howto;
  }

  function generateSubpoints(section) {
    return [
      `Understanding ${section} deeply`,
      `Practical examples and case studies`,
      `Common mistakes to avoid`,
    ];
  }

  function generateIntroduction(title, topic, tone, audience, targetWords) {
    const intros = {
      professional: `<p>Every ${audience || 'professional'} knows that ${topic.toLowerCase()} is one of the most important topics in today's landscape. But despite its importance, many people still struggle to get it right.</p>

<p>In this comprehensive guide, we'll break down exactly what you need to know about <strong>${topic}</strong> — from the fundamentals to advanced strategies that deliver results.</p>

<p>Whether you're just getting started or looking to level up your approach, this post has something for everyone. Let's dive in.</p>`,

      casual: `<p>Hey there! 👋 If you've ever found yourself wondering about <strong>${topic}</strong>, you're in the right place.</p>

<p>I've spent years diving deep into this topic — trying different approaches, making mistakes, and learning what actually works. And today, I'm sharing everything I've learned with you.</p>

<p>No fluff, no jargon. Just practical advice that you can start using right away. Sound good? Let's get started!</p>`,

      authoritative: `<p>The landscape of <strong>${topic}</strong> has fundamentally changed. What worked yesterday may not work today — and what works today might be obsolete tomorrow.</p>

<p>After analyzing hundreds of case studies and working with top performers in the field, I've identified the patterns that separate successful practitioners from everyone else.</p>

<p>This isn't theory. This is battle-tested strategy backed by data. Here's what you need to know about ${topic}.</p>`,

      conversational: `<p>So here's the thing about <strong>${topic}</strong>: most people overcomplicate it.</p>

<p>I used to think I needed some secret formula or insider knowledge. Turns out, the best practitioners share a few simple principles — and they're easier to implement than you might think.</p>

<p>In this post, I'm going to walk you through everything I wish someone had told me when I started. Buckle up — this is going to be useful.</p>`,
    };

    return `<h1>${title}</h1>\n${intros[tone] || intros.professional}`;
  }

  function generateSection(title, subpoints, topic, tone, audience, wordBudget) {
    const paragraphs = Math.min(3, Math.max(2, Math.floor(wordBudget / 200)));

    let content = `<h2>${title}</h2>\n`;

    // Intro paragraph for section
    content += `<p>When it comes to <strong>${title.toLowerCase()}</strong>, there's a lot to unpack. Let's break it down into actionable insights that you can apply immediately.</p>\n`;

    // Subpoint paragraphs
    subpoints.forEach((subpoint, idx) => {
      content += `<h3>${subpoint}</h3>\n`;
      content += `<p>Here's what most people miss about ${subpoint.toLowerCase()}: it requires a shift in perspective. Instead of focusing on the obvious approach, try thinking about it from a different angle.</p>`;

      if (idx % 2 === 0) {
        content += `<blockquote>"The key to success is not just knowing what to do — it's understanding why it works and adapting it to your specific situation."</blockquote>\n`;
      }

      content += `<p>Start by implementing this one change: ${subpoint.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}. Track your results for two weeks, then evaluate. You'll be surprised at the difference.</p>\n`;
    });

    // Practical tip box
    content += `<blockquote><strong>💡 Pro Tip:</strong> Consistency beats perfection every time. Focus on showing up daily, even if it's just 15 minutes. Small improvements compound over time.</blockquote>\n`;

    return content;
  }

  function generateConclusion(title, topic, tone, keywords, targetWords) {
    const conclusions = {
      professional: `<h2>${title}</h2>

<p>Implementing what we've covered in this guide about <strong>${topic}</strong> won't happen overnight — but the results will be worth it. The key is to start with one strategy, master it, then move on to the next.</p>

<p>Remember: ${keywords.length > 0 ? keywords.slice(0, 3).join(', ') + ' are foundational principles that apply across industries.' : 'The principles discussed here can be adapted to any situation.'}</p>

<p><strong>Ready to get started?</strong> Pick one area from this post and take action today. Your future self will thank you.</p>`,

      casual: `<h2>${title}</h2>

<p>And there you have it — everything you need to know about <strong>${topic}</strong> in one place. I know that's a lot to take in, so don't feel like you need to implement everything at once.</p>

<p>Start small. Pick one thing from this post and focus on it for the next week. Once it becomes a habit, add another. That's how real progress happens.</p>

<p>Drop a comment below and let me know which tip resonated with you most. I read every single one! 👇</p>`,

      authoritative: `<h2>${title}</h2>

<p>The difference between those who succeed with <strong>${topic}</strong> and those who don't comes down to one thing: execution. You now have the framework. The question is, what are you going to do with it?</p>

<p>Most people will read this post, feel motivated for a day, and then go back to business as usual. Don't be most people.</p>

<p><strong>Your next step:</strong> Choose one strategy from this post and commit to implementing it for the next 30 days. Measure your results. Iterate. Repeat. That's how you build an unfair advantage.</p>`,

      conversational: `<h2>${title}</h2>

<p>Look, I could keep writing about <strong>${topic}</strong> forever — there's always more to learn. But at some point, you just have to start.</p>

<p>The best time to start was yesterday. The second-best time is right now. Pick one thing from this post and do it today. Even if it's imperfect, even if you're not ready — just start.</p>

<p>I'll see you in the comments. Drop a line and tell me what you're going to try first! 🚀</p>`,
    };

    return conclusions[tone] || conclusions.professional;
  }

  function renderPost(post, topic) {
    const output = document.getElementById('postOutput');
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const readTime = Math.max(3, Math.ceil(post.content.length / 1000));

    output.innerHTML = `
      <article class="blog-post">
        <h1>${escapeHtml(topic)}</h1>
        <div class="post-meta">
          <span>${date}</span> · <span>${readTime} min read</span>
          ${post.keywords.length ? `<span> · ${post.keywords.slice(0, 3).join(', ')}</span>` : ''}
        </div>
        ${post.content}
      </article>
    `;
  }

  // ===== Copy & Download =====
  window.copyPost = function() {
    const postEl = document.querySelector('.blog-post');
    if (!postEl) return;
    navigator.clipboard.writeText(postEl.innerText).then(() => showToast('Post copied!'));
  };

  window.downloadMD = function() {
    const postEl = document.querySelector('.blog-post');
    if (!postEl) return;
    const html = postEl.innerHTML;
    const md = htmlToMarkdown(html);
    downloadFile(`${document.getElementById('topic').value.trim().replace(/[^a-z0-9]/g, '-').toLowerCase()}.md`, md, 'text/markdown');
  };

  window.downloadHTML = function() {
    const postEl = document.querySelector('.blog-post');
    if (!postEl) return;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(document.getElementById('topic').value.trim())}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:#fafafa;color:#2d2d2d;line-height:1.8;padding:40px 20px}
    .blog-post{max-width:700px;margin:0 auto;font-family:'Merriweather',Georgia,serif;font-size:16px}
    h1{font-size:32px;font-weight:700;margin-bottom:8px;color:#1a1a2e;line-height:1.2}
    .post-meta{font-family:'Inter',sans-serif;font-size:14px;color:#6b7280;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #e5e7eb}
    h2{font-size:24px;font-weight:700;margin:32px 0 16px;color:#1a1a2e}
    h3{font-size:18px;font-weight:600;margin:24px 0 12px;color:#2d2d2d}
    p{margin-bottom:16px}
    ul,ol{margin:16px 0;padding-left:24px}
    li{margin-bottom:8px}
    blockquote{border-left:4px solid #4f46e5;padding:16px 20px;margin:20px 0;background:#f8f8ff;border-radius:0 8px 8px 0;font-style:italic}
  </style>
</head>
<body>
  <article class="blog-post">${postEl.innerHTML}</article>
</body>
</html>`;
    downloadFile(`${document.getElementById('topic').value.trim().replace(/[^a-z0-9]/g, '-').toLowerCase()}.html`, html, 'text/html');
  };

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded!');
  }

  function htmlToMarkdown(html) {
    return html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // ===== Utilities =====
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:12px 24px;border-radius:8px;font-size:14px;z-index:9999;`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2000);
  }

  // ===== Persistence =====
  function saveDraft() {
    try {
      const data = {
        topic: document.getElementById('topic').value,
        tone: document.getElementById('tone').value,
        length: document.getElementById('length').value,
        keywords: document.getElementById('keywords').value,
        audience: document.getElementById('audience').value,
        includeSections: document.getElementById('includeSections').value,
        template: currentTemplate,
        ts: Date.now()
      };
      localStorage.setItem('blogcraft_draft', JSON.stringify(data));
    } catch (e) {}
  }

  function loadDraft() {
    try {
      const d = localStorage.getItem('blogcraft_draft');
      if (!d) return;
      const data = JSON.parse(d);
      if (Date.now() - data.ts > 86400000) return;

      document.getElementById('topic').value = data.topic || '';
      document.getElementById('tone').value = data.tone || 'professional';
      document.getElementById('length').value = data.length || 'medium';
      document.getElementById('keywords').value = data.keywords || '';
      document.getElementById('audience').value = data.audience || '';
      document.getElementById('includeSections').value = data.includeSections || '';

      if (data.template) {
        currentTemplate = data.template;
      }
    } catch (e) {}
  }

  // Auto-save on input
  document.querySelectorAll('.controls-panel input, .controls-panel textarea, .controls-panel select').forEach(el => {
    el.addEventListener('input', saveDraft);
    el.addEventListener('change', saveDraft);
  });

})();
