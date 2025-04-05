const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Fetch all videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await pool.query('SELECT * FROM mental_videos ORDER BY created_at DESC');
    res.json(videos.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Fetch video details with comments
router.get('/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const video = await pool.query('SELECT * FROM mental_videos WHERE id = $1', [id]);
    const comments = await pool.query('SELECT * FROM mental_comments WHERE video_id = $1', [id]);
    res.json({ video: video.rows[0], comments: comments.rows });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Post a comment
router.post('/comments', async (req, res) => {
  try {
    const { video_id, user_id, content } = req.body;
    const newComment = await pool.query(
      'INSERT INTO mental_comments (video_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [video_id, user_id, content]
    );
    res.json(newComment.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add a like
router.post('/likes', async (req, res) => {
  try {
    const { video_id, user_id } = req.body;
    const like = await pool.query(
      'INSERT INTO mental_likes (video_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [video_id, user_id]
    );
    if (like.rowCount === 0) {
      return res.status(409).json({ error: 'Already liked' });
    }
    await pool.query('UPDATE mental_videos SET likes = likes + 1 WHERE id = $1', [video_id]);
    res.json(like.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
