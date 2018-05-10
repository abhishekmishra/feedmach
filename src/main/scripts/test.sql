CREATE TABLE IF NOT EXISTS Feeds ( Id NOT NULL INTEGER PRIMARY KEY
                                                             ,  Name NOT NULL TEXT, Url TEXT NOT NULL UNIQUE
                                                                                                    ,  Added_date NOT NULL NUMERIC )