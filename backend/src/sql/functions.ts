const update_monument_rating = `
    CREATE OR REPLACE FUNCTION update_monument_rating() RETURNS trigger AS
    $$
    BEGIN
        IF (TG_OP = 'INSERT') THEN
            UPDATE monuments
            SET number_of_votes = number_of_votes + 1,
                votes_sum = votes_sum + NEW.rating
            WHERE id = NEW.fk_monument_id;
        ELSEIF (TG_OP = 'DELETE') THEN
            UPDATE monuments
            SET number_of_votes = number_of_votes - 1,
                votes_sum = votes_sum - OLD.rating
            WHERE id = OLD.fk_monument_id;
        ELSEIF (TG_OP = 'UPDATE') THEN
            UPDATE monuments
            SET votes_sum = votes_sum - OLD.rating + NEW.rating
            WHERE id = OLD.fk_monument_id;
        END IF;
        RETURN NEW;
    END;
    $$ 
    LANGUAGE PLPGSQL;
`;
const update_city_rating = `
    CREATE OR REPLACE FUNCTION update_city_rating() RETURNS trigger AS
    $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            UPDATE cities
            SET number_of_votes = number_of_votes - 1,
                votes_sum = votes_sum - OLD.rating
            WHERE id = OLD.fk_city_id;
        ELSEIF (TG_OP = 'UPDATE') THEN
            UPDATE cities
            SET votes_sum = votes_sum - OLD.rating + NEW.rating
            WHERE id = OLD.fk_city_id;
        END IF;
        RETURN NEW;
    END;
    $$
    LANGUAGE PLPGSQL;
`;
    
export {update_city_rating, update_monument_rating};