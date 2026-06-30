import { useTranslation } from '../../../i18n'
import data from './applicationDetailData.json'

export interface DetailField {
  label: string
  value: string
  placeholder?: string
}

interface FieldRaw {
  labelKey: string
  value: string
  placeholderKey?: string
}

/*
 * useApplicationDetail — 본사어드민 "제휴 / 투자 신청 상세" 데이터 훅
 * ------------------------------------------------------------------
 * 신청서 관리 목록의 "확인/검토/위험/삭제"에서 진입(Figma 1:16477 "제휴 / 투자 신청 상세").
 * applicationDetailData.json(더미)을 읽어 라벨/플레이스홀더는 번역해 반환한다.
 */
export function useApplicationDetail() {
  const { t } = useTranslation()
  const toFields = (fields: FieldRaw[]): DetailField[] =>
    fields.map((f) => ({ label: t(f.labelKey), value: f.value, placeholder: f.placeholderKey ? t(f.placeholderKey) : undefined }))

  return {
    fields: toFields(data.fields as FieldRaw[]),
    textFields: toFields(data.textFields as FieldRaw[]),
  }
}
