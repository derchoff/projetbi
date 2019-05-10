
UPDATE `wp_terms`
SET `name` = 'Sophrologues', `slug` = 'sophrologues'
WHERE `wp_terms`.`term_id` = 2;

TRUNCATE TABLE `wp_wpbdp_form_fields`;

INSERT INTO `wp_wpbdp_form_fields` (`id`, `label`, `description`, `field_type`, `association`, `validators`, `weight`, `display_flags`, `field_data`, `shortname`, `tag`) VALUES
(1, 'Nom du praticien', '', 'textfield', 'title', 'required', 9, 'excerpt,listing,search', 0x613a323a7b733a31303a22776f72645f636f756e74223b693a303b733a32303a22737570706f727465645f63617465676f72696573223b733a333a22616c6c223b7d, 'nom_du_praticien', 'title'),
(2, 'Domaine d\'activité', '', 'select', 'category', 'required', 8, 'excerpt,listing,search', 0x613a313a7b733a373a226f7074696f6e73223b613a303a7b7d7d, 'domaine_dactivite', 'category'),
(3, 'Description complète', '', 'textarea', 'content', 'required', 6, 'excerpt,listing,search', 0x613a31313a7b733a31303a22616c6c6f775f68746d6c223b623a303b733a31333a22616c6c6f775f696672616d6573223b623a303b733a31333a22616c6c6f775f66696c74657273223b623a303b733a31363a22616c6c6f775f73686f7274636f646573223b623a303b733a31303a226d61785f6c656e677468223b693a303b733a31343a22777973697779675f656469746f72223b623a303b733a31343a22777973697779675f696d61676573223b623a303b733a31363a22657863657270745f6f76657272696465223b693a303b733a31323a226175746f5f65786365727074223b623a303b733a31303a22776f72645f636f756e74223b693a303b733a32303a22737570706f727465645f63617465676f72696573223b733a333a22616c6c223b7d, 'description_complete', 'content'),
(4, 'Identifiant Easy-Appointments', '', 'textfield', 'meta', 'required', 0, '', 0x613a323a7b733a31303a22776f72645f636f756e74223b693a303b733a32303a22737570706f727465645f63617465676f72696573223b733a333a22616c6c223b7d, 'identifiant_easy-appointments', ''),
(5, 'Identifiant des prestations en ligne', '', 'textfield', 'meta', 'required', 0, '', 0x613a323a7b733a31303a22776f72645f636f756e74223b693a303b733a32303a22737570706f727465645f63617465676f72696573223b733a333a22616c6c223b7d, 'identifiant_des_prestations_en_ligne', ''),
(6, 'Type de prise en charge', '', 'multiselect', 'tags', '', 0, 'excerpt,listing,search', 0x613a343a7b733a343a2273697a65223b693a343b733a373a226f7074696f6e73223b613a303a7b7d733a31353a22656d7074795f6f6e5f736561726368223b623a313b733a32303a22737570706f727465645f63617465676f72696573223b733a333a22616c6c223b7d, 'type_de_prise_en_charge', 'tags');


CREATE TABLE `wordpress`.`wp_ea_appointments_secrets` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `id_app` INT NOT NULL ,
  `email` VARCHAR(250) NOT NULL ,
  `secret` CHAR(4) NOT NULL ,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;


DELIMITER //
CREATE PROCEDURE insert_tag
(IN name VARCHAR(200), slug VARCHAR(200))
BEGIN

  INSERT INTO `wp_terms` (`name`, `slug`)
  VALUES (name, slug);

  SET @last_id = LAST_INSERT_ID();

  INSERT INTO `wp_term_taxonomy` (`term_taxonomy_id`, `term_id`, `taxonomy`, `description`)
  VALUES (@last_id, @last_id, 'wpbdp_tag', '');

END //
DELIMITER ;

CALL insert_tag('Angoisse', 'angoisse');
CALL insert_tag('Examens', 'examens');
CALL insert_tag('Gestion du stress', 'gestion-du-stress');
CALL insert_tag('Troubles du sommeil', 'troubles-du-sommeil');
CALL insert_tag('Addictologie', 'addictologie');
CALL insert_tag('Fibromyalgie', 'fibromyalgie');
CALL insert_tag('Confiance en soi', 'confiance-en-soi');
CALL insert_tag('Gestion du stress', 'gestion-du-stress');
CALL insert_tag('Troubles-psychosomatiques', 'troubles-psychosomatiques');


CALL insert_tag('Tous publics', 'tous-publics');
CALL insert_tag('Enfant', 'enfant');
CALL insert_tag('Future maman', 'future-maman');
CALL insert_tag('Adolescent', 'adolescent');
CALL insert_tag('Senior', 'Senior');
