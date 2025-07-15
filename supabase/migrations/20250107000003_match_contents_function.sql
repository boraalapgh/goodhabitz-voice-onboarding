-- Function for semantic search using pgvector
CREATE OR REPLACE FUNCTION match_contents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  kind content_kind,
  description text,
  duration int,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    contents.id,
    contents.title,
    contents.kind,
    contents.description,
    contents.duration,
    1 - (contents.embedding <=> query_embedding) as similarity
  FROM contents
  WHERE contents.embedding IS NOT NULL
    AND 1 - (contents.embedding <=> query_embedding) > match_threshold
  ORDER BY contents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$; 