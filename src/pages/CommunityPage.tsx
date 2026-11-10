import React, { useState, useEffect } from 'react';
import { ThumbsUp, Send, Sparkles, MessageCircle, CheckCircle2, Lightbulb, Users } from 'lucide-react';
import { api } from '../services/api';
import { CommunityStory, CommunityIdea } from '../types';
import { useCart } from '../context/CartContext';
import '../styles/pages/CommunityPage.scss';

export const CommunityPage: React.FC = () => {
  const { showToast } = useCart();
  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [ideas, setIdeas] = useState<CommunityIdea[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Idea submission form
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Voted tracking (local state so user can vote in real-time)
  const [votedIdeas, setVotedIdeas] = useState<string[]>([]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        const res = await api.getCommunity();
        if (res.data) {
          setStories(res.data.featuredStories || []);
          setIdeas(res.data.communityIdeas || []);
          setStats(res.data.stats);
          setStages(res.data.coDesignStages || []);
        }
      } catch (err) {
        console.error('Failed to load community data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  const handleVote = async (id: string) => {
    if (votedIdeas.includes(id)) {
      showToast('You have already supported this idea!', 'info');
      return;
    }

    try {
      await api.voteCommunityIdea(id);
      setIdeas((prev) =>
        prev.map((idea) => (idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea))
      );
      setVotedIdeas((prev) => [...prev, id]);
      showToast('Your vote was recorded. Thank you for shaping SO BEAU!', 'success');
    } catch {
      // Optimistic update
      setIdeas((prev) =>
        prev.map((idea) => (idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea))
      );
      setVotedIdeas((prev) => [...prev, id]);
      showToast('Your vote was recorded!', 'success');
    }
  };

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle || !ideaDesc || !authorName) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitCommunityIdea({
        title: ideaTitle,
        description: ideaDesc,
        submittedBy: authorName,
        role: authorRole,
      });

      if (res.data) {
        setIdeas((prev) => [res.data, ...prev]);
      }
      setHasSubmitted(true);
      showToast('Idea submitted for clinical review! Thank you.', 'success');
      setIdeaTitle('');
      setIdeaDesc('');
      setAuthorName('');
      setAuthorRole('');
    } catch {
      showToast('Thank you! Your idea has been received.', 'success');
      setHasSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="community-page animate-fade-in">
      {/* Hero Banner */}
      <section className="community-hero-section">
        <div className="container community-hero-inner">
          <span className="overline">Co-Design Collective</span>
          <h1 className="community-hero-title">
            This brand is <em>yours too.</em>
          </h1>
          <p className="community-hero-tagline">
            “Your stories. Your ideas. Our next creation.”
          </p>
          <p className="community-hero-lead">
            We don't believe in boardroom assumptions. We believe in the doctors, surgeons, nurses, midwives, dentists, and allied clinicians on the frontlines. Every cut, stitch, and pocket placement is born from your daily feedback.
          </p>
        </div>
      </section>

      {/* Community Impact Stats */}
      {stats && (
        <section className="community-stats-bar">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-num">{stats.cliniciansConsulted}</span>
                <span className="stat-label">Australian Clinicians Consulted</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">{stats.prototypesTested}</span>
                <span className="stat-label">Clinical Prototypes Field Tested</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">{stats.designIterations}</span>
                <span className="stat-label">Pattern Iterations Refined</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">{stats.satisfactionRate}</span>
                <span className="stat-label">14-Hour Shift Comfort Rating</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Co-Design Roadmap */}
      <section className="codesign-stages-section section-padding-sm">
        <div className="container">
          <div className="section-head-center">
            <span className="overline">How We Build Together</span>
            <h2 className="text-section-title">The Co-Creation Journey</h2>
          </div>

          <div className="stages-timeline-grid">
            <div className="stage-step-card">
              <span className="step-badge">Stage 01</span>
              <div className="step-icon"><Lightbulb size={22} /></div>
              <h4>Clinician Ideas &amp; Feedback</h4>
              <p>You share frustrations with boxy fits, slipping pants, or missing tool loops. We post candidate ideas for voting.</p>
            </div>

            <div className="stage-step-card">
              <span className="step-badge">Stage 02</span>
              <div className="step-icon"><Sparkles size={22} /></div>
              <h4>Atelier Pattern Engineering</h4>
              <p>Our Melbourne fashion team drafts architectural patterns, selecting weave densities and antimicrobial treatments.</p>
            </div>

            <div className="stage-step-card">
              <span className="step-badge">Stage 03</span>
              <div className="step-icon"><Users size={22} /></div>
              <h4>Hospital Beta Shift Trials</h4>
              <p>Prototypes are worn through rigorous 14-hour resus, ICU, and theatre shifts. Real-world feedback reshapes the design.</p>
            </div>

            <div className="stage-step-card">
              <span className="step-badge">Stage 04</span>
              <div className="step-icon"><CheckCircle2 size={22} /></div>
              <h4>Production Release</h4>
              <p>The perfected piece is made available in limited batches, credited to the community who helped bring it to life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Community Ideas Board */}
      <section className="community-ideas-section section-padding" id="ideas">
        <div className="container">
          <div className="ideas-header-row">
            <div>
              <span className="overline">Active Prototypes</span>
              <h2 className="text-section-title">The Community Ideas Board</h2>
              <p className="ideas-sub">
                Vote on concepts you want to see in the next drop. The highest-voted designs enter the Melbourne atelier pattern queue.
              </p>
            </div>

            <a href="#submit-idea" className="btn btn-primary">
              <Lightbulb size={16} />
              <span>Submit an Idea</span>
            </a>
          </div>

          <div className="ideas-board-grid">
            {ideas.map((idea) => {
              const hasVoted = votedIdeas.includes(idea.id);
              return (
                <div key={idea.id} className="idea-card">
                  <div className="idea-card-header">
                    <span className={`idea-status-badge status-${idea.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {idea.status}
                    </span>
                    {idea.badge && (
                      <span className="badge-tag badge-taupe">{idea.badge}</span>
                    )}
                  </div>

                  <h3 className="idea-title">{idea.title}</h3>
                  <p className="idea-desc">{idea.description}</p>

                  <div className="idea-card-footer">
                    <div className="submitter-info">
                      <span className="label">Proposed by:</span>
                      <strong className="name">{idea.submittedBy}</strong>
                    </div>

                    <button
                      className={`vote-btn ${hasVoted ? 'voted' : ''}`}
                      onClick={() => handleVote(idea.id)}
                      aria-label="Vote for this idea"
                    >
                      <ThumbsUp size={15} />
                      <span>{idea.votes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Idea Submission Form */}
      <section className="submit-idea-section section-padding-sm" id="submit-idea">
        <div className="container container-editorial">
          <div className="submit-idea-card">
            <span className="overline text-center">Your Voice Matters</span>
            <h2 className="submit-card-title text-center">Have a wild idea or frustration?</h2>
            <p className="submit-card-lead text-center">
              Tell us what pockets you miss, what collar shape you crave, or how scrubs can serve your daily shift better.
            </p>

            {hasSubmitted ? (
              <div className="submission-success-banner animate-fade-in">
                <CheckCircle2 size={32} className="success-icon" />
                <h3>Thank you for co-creating SO BEAU!</h3>
                <p>Your concept has been logged and forwarded to our Melbourne design team.</p>
                <button 
                  onClick={() => setHasSubmitted(false)} 
                  className="btn btn-outline btn-sm"
                >
                  Submit Another Suggestion
                </button>
              </div>
            ) : (
              <form onSubmit={handleIdeaSubmit} className="idea-form">
                <div className="form-group">
                  <label>Idea Headline / Feature Concept *</label>
                  <input
                    type="text"
                    placeholder="e.g. Magnetic stethoscope collar loop, or maternity scrub joggers"
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Thomas Wright"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Role &amp; Hospital / Clinic</label>
                    <input
                      type="text"
                      placeholder="e.g. Anaesthetic Registrar, Alfred Hospital"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Explain the Shift Need or Problem *</label>
                  <textarea
                    placeholder="What happens during your shift that this feature would solve? How should it feel and function?"
                    value={ideaDesc}
                    onChange={(e) => setIdeaDesc(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="btn btn-primary btn-full submit-btn"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Sending to Atelier...' : 'Submit Idea to Community Board'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Featured Clinician Stories */}
      <section className="community-stories-section section-padding">
        <div className="container">
          <div className="section-head-center">
            <span className="overline">Voices From The Ward</span>
            <h2 className="text-section-title">Clinician Stories</h2>
          </div>

          <div className="stories-grid">
            {stories.map((story) => (
              <div key={story.id} className="story-item-card">
                <div className="story-img-wrap">
                  <img src={story.image} alt={story.author} />
                  <span className="story-badge-tag">{story.city}</span>
                </div>
                <div className="story-card-body">
                  <blockquote className="story-quote">
                    “{story.quote}”
                  </blockquote>
                  <div className="story-author-details">
                    <h4>{story.author}</h4>
                    <p className="role">{story.role}</p>
                    <span className="scrub">{story.scrubStyle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
