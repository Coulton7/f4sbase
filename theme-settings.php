<?php
use Drupal\Core\Form\FormStateInterface;
function f4sbase_form_system_theme_settings_alter(&$form, FormStateInterface $form_state, $form_id=NULL) {
  if(isset($form_id)) {
      return;
  }
  // custom settings respective to theme
  // create setting for secondary logo
  $form['secondary_logo'] = array(
    '#type'         => 'details',
    '#title'        => t('Secondary Logo'),
    '#open'         => TRUE,
  );
  $form['secondary_logo']['secondary_logo_path'] = array(
    '#type'           => 'textfield',
    '#title'          => t('Secondary Logo Path'),
    '#default_value'  => theme_get_setting('secondary_logo_path'),
    '#description'    => t('Examples: logo.svg (for a file in the public filesystem), public://logo.svg, or themes/custom/test/logo.svg.')
  );
  $form['secondary_logo']['second_logo'] = array(
      '#type' => 'managed_file',
      '#title' => t('Secondary Logo'),
      '#required' => FALSE,
      '#upload_location' => 'public://secondary-logo',
      '#default_value' => theme_get_setting('second_logo'),
      '#upload_validators' => array(
      'file_validate_extensions' => array('gif png jpg jpeg svg'),
    ),
  );
}